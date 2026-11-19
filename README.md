# 58Client – official website

Static GitHub Pages site with a cherry blossom theme. No backend, no build step
and no external dependencies – just HTML, CSS, JavaScript and SVG.

## Files

- `index.html` – all page content and reusable SVG icons
- `style.css` – theme, layouts, animations and responsive design
- `script.js` – mobile menu, falling petals, toasts and the interactive ClickGUI
- `assets/favicon.svg` – favicon

## Publish with GitHub Pages

1. Create a new repository (for example `58Client`) and upload the contents of
   **this folder** to the repository root.
2. Open **Settings → Pages** in the repository.
3. Choose **Deploy from a branch**, the `main` branch and the `/ (root)` folder.
4. Save. The site will be published at `https://<username>.github.io/58Client/`.

Alternatively, place this folder in an existing repository as `docs/` and select
`/docs` as the source under Settings → Pages.

## Placeholders before publishing

The following links do not exist yet and are therefore clear placeholders that
show a message when clicked (no links were invented):

- **Discord** – buttons in the hero, the menu (which links to the footer) and the footer.
- **Download** – the button in the download section.

Replace the `data-toast` attributes or swap the buttons for `<a href="...">`
once real links are available. The version information (1.0.0 / Minecraft 1.21.11)
comes from the project's existing `Client58Fly/README.md`.

## Customization

Colors, radii and fonts are defined as CSS variables at the top of `style.css`.
The modules and categories in the preview are defined in `script.js` under
`var categories`.
