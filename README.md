# Kamran Afzal — Portfolio Site

A multi-page personal portfolio for Kamran Afzal, YouTube scriptwriter. Plain
HTML/CSS/JS + jQuery, no build tools, no backend, no API keys.

## File structure

```
index.html                          main page, all sections
404.html                            not-found page
skills.json                         skills list, rendered into #skills
portfolio.json                      7 portfolio-folder cards (with images), rendered into #portfolioGrid
research.json                       research write-ups (Olmec entry is "featured"), rendered into the 3 research grids
assets/css/style.css                full stylesheet
assets/js/app.js                    library setup (particles / typed / tilt / scrollreveal)
assets/js/script.js                 nav toggle, scrollspy, JSON rendering, contact form
assets/images/profile.jpg           hero profile photo (swap this file to update the photo)
assets/images/portfolio/*.jpg       one thumbnail per portfolio folder card
assets/images/education/*.jpg       campus photos for the two education cards
assets/images/research/*.jpg        Olmec featured-doc cover + the two research section banners
.nojekyll                           tells GitHub Pages to serve every file as-is
```

### Updating a portfolio folder / research thumbnail
Replace the image file in `assets/images/portfolio/` (or `.../research/`,
`.../education/`) with a same-named file, or point the `"image"` field in
`portfolio.json` / `research.json` at a new path — no HTML edits needed.

## Running it locally

The page loads `skills.json`, `portfolio.json`, and `research.json` with
`fetch`/`$.getJSON`, which browsers block over a bare `file://` URL. You need
a local server:

```bash
# from the project root
python3 -m http.server 8000
# then open http://localhost:8000
```

Or, if you have Node:

```bash
npx serve .
```

Opening `index.html` directly by double-clicking it will load, but the
JSON-driven sections (Skills, Portfolio, Research) will show "Loading…" and
never populate — that's the `file://` restriction, not a bug.

## Deploying to GitHub Pages

1. Create a repo named exactly `<your-username>.github.io` (this makes the
   site live at the domain root, so the relative paths in this project — like
   `assets/css/style.css` — resolve correctly without a repo-name prefix).
2. Push all files in this project to the `main` branch of that repo,
   including the hidden `.nojekyll` file (some file managers hide dotfiles —
   make sure it's actually committed, e.g. `git add -A` will catch it).
3. In the repo's Settings → Pages, set the source to the `main` branch,
   root folder.
4. Wait a minute or two, then visit `https://<your-username>.github.io`.

If you'd rather deploy under a regular repo name (not
`username.github.io`), the site will live at
`https://<your-username>.github.io/<repo-name>/` instead — that's fine too,
since every path in this project is relative, not absolute.

## Editing content without touching HTML/CSS

### Add or remove a portfolio folder card

Edit `portfolio.json`. Each entry looks like:

```json
{ "icon": "🎬", "name": "Documentary", "url": "https://drive.google.com/drive/folders/..." }
```

Add a new object to the array for a new folder, or delete one to remove it.
The `icon` field accepts any emoji. `url` should be the "Anyone with the
link" sharing URL from Google Drive.

### Add or remove a research write-up

Edit `research.json`. Each entry looks like:

```json
{
  "category": "history",
  "title": "Your Title Here",
  "url": "https://drive.google.com/open?id=...",
  "tags": ["Tag One", "Tag Two"]
}
```

`category` must be one of `"history"`, `"geopolitics"`, or `"true-crime"` to
land in the matching section on the page. To add a brand-new category
section (a 4th or 5th research area), you'll need one small HTML addition:
copy one of the existing `<section>` blocks for History/Geopolitics/True
Crime in `index.html`, give it a new `id` and a new grid `id` (e.g.
`id="techGrid"`), then add one line in `assets/js/script.js` inside the
`.done()` callback for `research.json`:

```javascript
renderResearch(items, "your-new-category", "#yourNewGridId");
```

### Add or remove a skill

Edit `skills.json`. Skills are grouped, so you can add a new group object
or add/remove strings inside an existing group's `items` array.

### Update the photo

Replace `assets/images/profile.jpg` with a new image of the same name (any
image format will work despite the `.jpg` extension, since browsers read the
actual file bytes, not the extension).

### Update contact info

The email address appears in three places in `index.html`: the About card,
the Contact section, and the footer. It's also used in the contact form's
`mailto:` link inside `assets/js/script.js` — search for
`kamranafzal12.ka@gmail.com` in both files if it ever changes.

## Changelog — cinematic upgrade + bug fixes (this pass)

**Bugs fixed:**
- **Particles background was silently dead.** The CDN URL was malformed
  (`.../particles.js/2.0.0/particles.min.js`, missing the `/npm/` segment
  jsDelivr requires) — the script 404'd and `particlesJS` was never defined,
  so `app.js`'s check silently no-op'd. Fixed to
  `https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js`.
- **`.nojekyll` was missing from the deployed repo** even though it was
  referenced in the README — added it for real this time.

**New — profile photo:** unchanged behavior, still a single-file swap at
`assets/images/profile.jpg`. The hero photo now floats gently and sits in a
glowing ring — see "Hero visual" below.

**New — real images throughout:**
- Each of the 7 Portfolio Category folder cards now shows a cinematic 16:9
  thumbnail (dark gradient overlay, zoom on hover) instead of a bare icon.
- The "Do the Olmec Heads..." write-up is now a full-width **Featured
  Documentary** banner card (wider aspect ratio, larger title, a "Featured
  Documentary" badge) instead of a plain card, matching the rest of the
  research grid's card component so nothing else had to change.
- Both education cards now show real campus photos with the same
  gradient-overlay treatment as the portfolio cards.
- The "Historical Investigations & Archaeology" and "Geopolitical & Economic
  Analysis" sections each got a faded full-width cinematic banner image
  behind their heading.
- All Google Drive links, routing, and JSON structure are unchanged — only
  `image` fields were added to `portfolio.json`/`research.json`.

**Hero visual:** the floating animation was deliberately put on the
`.hero-visual` wrapper, not `.photo-ring` itself — Vanilla-Tilt also sets a
`transform` on `.photo-ring` on hover, and animating `transform` on the same
element a JS library also controls causes the two to fight/snap. Keeping them
on separate elements avoids that.

**Everything else — layout, nav, routing, JSON architecture, contact form,
scrollspy — is untouched.**
