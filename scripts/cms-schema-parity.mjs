/**
 * Checks that the editor offers exactly the fields the build will accept.
 *
 *   node scripts/cms-schema-parity.mjs
 *
 * ## Why this exists
 *
 * src/content.config.ts decides what the build accepts. public/admin/config.yml
 * decides what Sam can type. They are two files that have to agree, and nothing
 * in either of them notices when they stop.
 *
 * The first time they were compared, they disagreed twice. One was harmless —
 * a block type left in the schema that nothing used. The other was not: the
 * home page's hero carries the before / after claim demo, the editor did not
 * offer those fields, and a CMS writes back the fields it knows about. Saving
 * the home hero would have deleted the claim demo, with nothing anywhere
 * saying it had gone. That is the class of bug this script exists to catch,
 * and it is invisible to a typecheck, a build, an axe run and a page diff,
 * because the page is only wrong after somebody edits it.
 *
 * ## What it does not check
 *
 * Widget types, labels and hints. Those are editor ergonomics; getting one
 * wrong makes the form awkward, not the site wrong. This checks the shape.
 */
import { readFile } from 'node:fs/promises';

const ROOT = new URL('..', import.meta.url).pathname;

/* Fields every block has, defined once in the schema's `base` and spread in. */
const BASE = ['name', 'band', 'tight', 'headingGap', 'plain', 'nestSplit'];

/*
 * Nothing is allow-listed any more. Every schema field is either an editable
 * control or a `widget: hidden` that round-trips, so a gap here is always a
 * real one. The allow-list this replaced was the wrong shape: it silenced the
 * exact finding it should have surfaced.
 */
const UNUSED_ALLOWLIST = {};

/** Top-level keys of a `z.object({...})`, by brace depth rather than regex. */
function zodFields(body) {
  const out = [];
  let depth = 0;
  let line = '';
  for (const ch of body) {
    if (ch === '\n') {
      /* `figure: figure.optional()` and the shorthand `figure,` are both
         fields. Missing the second reported a real field as unknown. */
      const m = line.match(/^\s*([a-zA-Z][\w]*)\s*(?::|,\s*$)/);
      if (depth === 0 && m) out.push(m[1]);
      line = '';
      continue;
    }
    line += ch;
    if ('({['.includes(ch)) depth++;
    if (')}]'.includes(ch)) depth--;
  }
  return out;
}

/** Every `z.object({ ... type: z.literal('x') ... })` in the union. */
function parseSchema(src) {
  const blocks = {};
  const re = /z\.object\(\{/g;
  let m;
  while ((m = re.exec(src))) {
    let i = m.index + m[0].length;
    let depth = 1;
    const start = i;
    while (i < src.length && depth > 0) {
      if ('({['.includes(src[i])) depth++;
      if (')}]'.includes(src[i])) depth--;
      i++;
    }
    const body = src.slice(start, i - 1);
    const type = body.match(/type:\s*z\.literal\('([a-zA-Z]+)'\)/);
    if (!type) continue;
    const fields = new Set(zodFields(body).filter((f) => f !== 'type'));
    if (body.includes('...base')) for (const b of BASE) fields.add(b);
    blocks[type[1]] = fields;
  }
  return blocks;
}

/**
 * Resolves the config's YAML anchors before anything looks at it.
 *
 * The shared fields — the band select, the tight switch, the figure object —
 * are written once and aliased with `*band` and friends. That is fine for the
 * editor, which uses a real YAML parser, and invisible to anything reading the
 * file line by line. Expanding them here rather than in the file itself was
 * the second attempt: the first rewrote config.yml with line surgery and broke
 * it, which is what happens when a structured file is edited as text.
 */
function expandAnchors(yaml) {
  const nameOf = {};
  const lines = yaml.split('\n');

  lines.forEach((line, i) => {
    const inline = line.match(/^\s*-\s*&(\w+)\s*\{\s*name:\s*(\w+)/);
    if (inline) {
      nameOf[inline[1]] = inline[2];
      return;
    }
    const block = line.match(/^\s*-\s*&(\w+)\s*$/);
    if (!block) return;
    for (let j = i + 1; j < lines.length; j++) {
      const m = lines[j].match(/^\s*name:\s*(\w+)\s*$/);
      if (m) {
        nameOf[block[1]] = m[1];
        break;
      }
    }
  });

  /*
   * Only the field's name is substituted, not its body. This check compares
   * shapes: which fields a block has in the schema against which the editor
   * offers. Widgets, labels and hints are the editor's business.
   */
  return lines
    .map((line) => {
      const use = line.match(/^(\s*)-\s*\*(\w+)\s*$/);
      if (use && nameOf[use[2]]) return `${use[1]}- name: ${nameOf[use[2]]}`;
      /* The definition site is a field on whichever block declares it, and
         `- &band` on its own line hides the name from a line-based reader. */
      const def = line.match(/^(\s*)-\s*&(\w+)\s*$/);
      if (def && nameOf[def[2]]) return `${def[1]}- name: ${nameOf[def[2]]}`;
      const inlineDef = line.match(/^(\s*)-\s*&(\w+)\s*\{/);
      if (inlineDef && nameOf[inlineDef[2]]) {
        return `${inlineDef[1]}- name: ${nameOf[inlineDef[2]]}`;
      }
      return line;
    })
    .join('\n');
}

/**
 * Field names under one `types:` entry in the CMS config.
 *
 * Matched at the indent the block types sit at, not anywhere in the file.
 * `figure` is both a block type and a field on several other blocks, so a
 * plain search for "- name: figure" finds the field inside `prose` and
 * reports the wrong block's shape — which it did, as three findings that
 * looked real and were not.
 */
function cmsFields(yaml, name) {
  const lines = yaml.split('\n');
  const typesAt = lines.findIndex((l) => /^\s*types:\s*$/.test(l));
  if (typesAt === -1) return null;

  /* The indent of the block-type entries: the first list item after `types:`. */
  const first = lines.slice(typesAt + 1).find((l) => /^\s*- name:/.test(l));
  if (!first) return null;
  const typeIndent = first.length - first.trimStart().length;

  const at = lines.findIndex(
    (l, i) => i > typesAt && l === `${' '.repeat(typeIndent)}- name: ${name}`,
  );
  if (at === -1) return null;

  const out = new Set();
  let fieldIndent = null;
  for (let i = at + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const indent = line.length - line.trimStart().length;
    /* The next block type ends this one. */
    if (indent <= typeIndent) break;
    if (/^\s*fields:\s*$/.test(line)) {
      if (fieldIndent === null) {
        const next = lines.slice(i + 1).find((l) => l.trim());
        fieldIndent = next ? next.length - next.trimStart().length : null;
      }
      continue;
    }
    if (fieldIndent === null || indent !== fieldIndent) continue;
    const named = line.match(/^\s*-\s*\{?\s*name:\s*([a-zA-Z][\w]*)/);
    if (named) out.add(named[1]);
  }
  return out;
}

const schema = parseSchema(await readFile(`${ROOT}src/content.config.ts`, 'utf8'));
const yaml = expandAnchors(await readFile(`${ROOT}public/admin/config.yml`, 'utf8'));

let problems = 0;
const types = Object.keys(schema).sort();
console.log(`  ${types.length} block types in the schema\n`);

for (const t of types) {
  const offered = cmsFields(yaml, t);
  if (offered === null) {
    console.log(`  MISSING  the editor does not offer the "${t}" block at all`);
    problems++;
    continue;
  }
  const missing = [...schema[t]]
    .filter((f) => !offered.has(f))
    .filter((f) => !(f in UNUSED_ALLOWLIST));
  const extra = [...offered].filter((f) => !schema[t].has(f));
  for (const f of missing) {
    console.log(`  LOSES    "${t}" has "${f}" but the editor does not — saving would drop it`);
    problems++;
  }
  for (const f of extra) {
    console.log(`  UNKNOWN  the editor offers "${t}.${f}", which the build will reject`);
    problems++;
  }
}

console.log(
  problems === 0
    ? '  the editor and the build agree on every block'
    : `\n  ${problems} disagreement(s)`,
);
process.exit(problems ? 1 : 0);
