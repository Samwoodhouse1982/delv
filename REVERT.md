# How to get back to the working site

Written 15 September 2026, before the growth-narrative work started.

The known-good commit is **`e83773f`**, and `origin/pre-growth-narrative` is a
branch pinned to it that nothing else will ever move. That is the thing to come
back to.

## What that commit is

Everything below was verified in a browser at `e83773f`, not assumed:

- 12 pages build clean; `astro check` 0 errors, 0 warnings, 0 hints
- axe-core clean across 12 pages at 5 viewport widths
- no horizontal overflow at any width from 320px up
- no console or page errors across 12 routes, in both motion modes
- CLS 0.0004, FCP around 120ms, 6 requests, no render-blocking JavaScript
- no broken links, no missing assets, no anchor without an `href`
- claim-demo suite 14 passing, logo suite 11, nav suite 8
- strapline "Prove the value. Prove your why." on all 12 pages

Motion at that point: the claim demo on the home page, five section graphics on
their own loops, scroll reveals, and the logo dot. All of it gated behind
`prefers-reduced-motion` and the `data-motion` attribute.

## Three routes back, fastest first

### 1. Vercel instant rollback — seconds, no git

In the Vercel dashboard, Deployments, find the last deployment built from
`e83773f`, and use **Instant Rollback** (or Promote to Production). Production
serves the old build immediately. Nothing in the repository changes, so the code
and the live site disagree until you also do route 2 — but the site is right,
which is what matters at three in the afternoon.

Use this when the site is live and something is wrong on it.

### 2. Move `main` back — the real revert

```
git fetch origin
git checkout -B main origin/pre-growth-narrative
git push --force-with-lease origin main
```

`--force-with-lease` rather than `--force`: it refuses if someone else has pushed
to `main` since you last fetched, which is the one case where a plain force does
real damage.

This discards the growth-narrative commits from `main`. They are not lost — they
stay on their own branch, and on `origin/pre-growth-narrative`'s sibling history —
so this is reversible in turn.

Use this when the experiment is being abandoned.

**A force-push back onto an old commit may not redeploy.** Vercel keys builds
by commit SHA, so moving `main` back onto a SHA it has already built can leave
production pointed at the newer build: the repository is right and the live
site is a version behind it, which looks exactly like a revert that did not
work. This happened on 17 September 2026 and cost an hour. Either promote the
old deployment by hand (route 1) or push one further commit so there is a SHA
Vercel has not seen.

### 3. Revert the merge, keeping the history

```
git revert -m 1 <merge-commit>
git push origin main
```

Adds a commit that undoes the change rather than rewriting history. Slower to
read later, but nothing is force-pushed and anyone with the repository checked
out is unaffected.

Use this if the work has been merged and shared, and someone else is working on
the repository.

## Checking you are actually back

```
npm ci && npm run build && npx astro check
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/opt/pw-browsers/chromium node scripts/a11y.mjs
```

`astro check` clean and "axe: clean across 12 pages x 5 widths" means the site is
the site again.

## Why a branch and not a tag

A tag would be the conventional marker and it is what this should have been. The
repository refuses tag pushes — `refs/tags/*` returns HTTP 403 while branch
pushes succeed — so `pre-growth-narrative` is a branch instead. It pins the same
commit and works the same way for every command above. If the tag rule is ever
relaxed, `git tag -a pre-growth-narrative e83773f` and push it; the local tag
already exists in this working copy.

## What happened to the growth narrative

Built 15 to 16 September 2026, merged, and reverted on the 17th at Sam's
request. It is not deleted: the whole of it is on
**`origin/claude/sweet-carson-uaraxe`** at `3150a22` — the branching root
system, the stem and canopy, the page-level stage architecture, the mechanism
that stills the section graphics, and a 15-assertion test suite.

If it is ever picked up again, start with the architecture rather than the
drawing. The ground line was put in the document flow rather than fixed to the
viewport, which is right for the descent and is also what left the tree with
nowhere to stand: by the end of the page the horizon is thousands of pixels
above, so beats 5 and 6 needed a second horizon at the foot of the page. That
decision is the one to revisit first.

## One thing this does not cover

The commit is the code. It is not the Vercel environment variables, the domain,
or anything set in a dashboard. `CONTACT_WEBHOOK_URL` and the rest live outside
git and reverting the code will not restore them if they change.
