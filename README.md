# Mary Nunes — portfolio site

A single-page static portfolio. No build step, no framework, no CDN at
runtime — just HTML, one script, and images.

```
index.html          # the page (styles are inline, per the design export)
site.js             # typing tagline, work carousel, hover, draw-on-scroll doodles
assets/img/         # portrait (mary.jpeg)
assets/work/        # work-card images, one per client
assets/logos/       # client logos for the marquee
assets/favicon.svg
design/             # editable design-tool source (see below)
```

## Run it locally

Open `index.html` in a browser, or:

```bash
python3 -m http.server 8000
```

## What's on the page

- **Hero** with a tagline that types through the services Mary offers.
- **Selected Work** — a horizontal carousel of client pieces (real
  imagery, prev/next buttons, a scroll progress bar). Each card links to
  the brand.
- **Clients** — an auto-scrolling logo marquee that pauses on hover.
- **About** — portrait plus bio.
- **Contact** — the blue "Let's work together" band and footer.
- **Hand-drawn doodles** throughout (sun, underlines, circled labels, the
  arrow by the contact link) that draw themselves in on scroll. With
  JavaScript off or "reduce motion" set, they render fully drawn and the
  page still works — the tagline just shows the first service instead of
  typing.

## Editing content

Copy and layout live directly in `index.html` as inline styles (this is
how the design tool exports). The quickest things to change:

- **Tagline services** — the rotating list is the `roles` array at the top
  of `site.js`, and the first one is also hard-coded in the hero `<em>` so
  it shows before the animation starts.
- **Work cards** — each is an `<a href="…">` in the `#work-track` block:
  brand name, title, category label, link, and `assets/work/<brand>` image.
- **Client logos** — the marquee lists each logo twice (that's what makes
  the loop seamless); update both copies, or none.
- **About copy** — the paragraphs beginning "Placeholder copy" and the
  services list below them.
- **Email** — `mary@nuneswriting.com`, in both the contact link and footer.

## Colors

Design tokens are CSS custom properties in the `<style>` block in
`index.html`:

| Token | Value | Used for |
| --- | --- | --- |
| `--cream` | `#faf6ea` | page background |
| `--ink` | `#14110e` | headings, body, work-card backgrounds |
| `--ink-soft` | `#4d463c` | secondary text |
| `--rust` | `#E0617E` | pink accent — labels, doodles, links on hover |
| `--blue` | `#11459c` | contact band |

## Editable design source

`design/` holds the original design-tool export (`Mary Nunes
Portfolio.dc.html` and its `support.js` runtime). That format is for
re-opening and editing in the tool — it loads React and a compiler from a
CDN at runtime, so it is **not** what the site serves. The published site
is the self-contained `index.html` + `site.js` above, which is a faithful
port of that export. If you re-export from the tool, re-run the same port
(resolve the `{{ }}` bindings and `style-hover` attributes into `site.js`)
to keep the live site dependency-free.

## Deploying

Served by GitHub Pages from `main` at the repo root (`.nojekyll` keeps
Pages from running Jekyll over it). Any static host works the same way —
no build command, publish directory is the repo root.
