# Mary Nunes — portfolio site

A single-page static portfolio. No build step, no dependencies.

```
index.html          # all page content
styles.css          # all styles
assets/img/*.svg    # placeholder images (swap for real photos)
assets/favicon.svg
```

## Run it locally

Open `index.html` in a browser, or:

```bash
python3 -m http.server 8000
```

## Deploying

Any static host works — Netlify, Vercel, Cloudflare Pages, GitHub Pages.
Drag the folder in, or point the host at this repo. No build command,
publish directory is the repo root.

## Swapping in real content

**Copy.** Everything is placeholder text. The pieces to replace live in
`index.html`: the intro line under the name, the six `.work__row` items,
the About paragraphs (each one starts with the word "Placeholder"), the
services list, and the email address (`mary@nuneswriting.com`, which
appears in the CTA link and the footer).

**Work links.** Each work item points at `href="#"` — swap in the real URL.

**Images.** Drop real files into `assets/img/` and update the `src`
attributes. The hero strip images are cropped to 5:8 portrait and the
About portrait to 4:5, so anything roughly that shape will look right.
JPGs around 600×960 (strip) and 960×1200 (portrait) are plenty.

**Clients.** The ten client names are rendered as type, not logos, in the
`.clients` list. If real logo files show up later, replace each `<li>`
with an `<img>` — the grid cell sizing already handles it.

## Type

Inter for everything except the display serif (Playfair Display), which
covers the name, work titles, client names, and section headlines. Both
load from Google Fonts.

To make the site all-Inter, change one line in `styles.css`:

```css
--font-display: var(--font-sans);
```

## Colors

Defined as custom properties at the top of `styles.css`:

| Token | Value | Used for |
| --- | --- | --- |
| `--cream` | `#faf6ea` | page background |
| `--cream-dim` | `#f2ecdc` | clients band |
| `--ink` | `#14110e` | headings, body |
| `--ink-soft` | `#4d463c` | secondary text |
| `--rust` | `#c0512b` | accents, rules, numbers |
| `--blue` | `#10459b` | contact band |
