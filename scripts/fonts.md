# Refreshing the self-hosted fonts

Both faces are variable, SIL Open Font Licence 1.1, and served here from
`public/fonts/`. Two subsets each: `latin` covers everything the site's own
copy uses, `latin-ext` only loads if a name or a loan word needs it.

The files came from the Google Fonts CDN, which serves the variable woff2 to a
modern user agent:

```
curl -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36" \
  "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Newsreader:opsz,wght@6..72,200..800&display=swap"
```

That returns one `@font-face` per subset; take the `latin` and `latin-ext`
URLs and save them under the names already in `public/fonts/`. The
`unicode-range` values in `src/styles/global.css` come from the same response
and must be updated alongside the files.

After replacing a font file, re-derive the fallback metrics:

```
npm run fonts:metrics
```

and paste the two `@font-face` blocks it prints over the `* Fallback` rules in
`src/styles/global.css`. Skipping this is how you get layout shift back.

`OFL.txt` must stay next to the files — the licence permits self-hosting on
condition the notice travels with them.
