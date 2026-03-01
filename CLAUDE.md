# CLAUDE.md

## Project Overview

BRIE is a free, Montessori-inspired toddler play app for ages 2-4. No ads, no rules, no data collected—just play. Deployed to GitHub Pages at https://darrelpoldev.github.io/brie/.

## Tech Stack

- **Framework:** React 18 with Vite 5
- **Language:** JavaScript (JSX)
- **Styling:** Inline styles (CSS-in-JS) and injected global CSS
- **Audio:** Web Audio API (no external libraries)
- **Deployment:** GitHub Pages via GitHub Actions

## Commands

```bash
npm install        # Install dependencies
npm run dev        # Start dev server with hot reload
npm run build      # Production build (outputs to dist/)
npm run preview    # Preview production build locally
```

## Project Structure

```
src/
  App.jsx          # Main app component (all UI, game logic, audio)
  main.jsx         # React entry point
index.html         # HTML entry point
vite.config.js     # Vite config (base: /brie/)
```

## Code Conventions

- Functional React components with hooks
- Inline style objects for component styling
- SVG shapes generated programmatically
- Mobile-first, touch-friendly design
- CSS animations defined via injected `<style>` tags
- Responsive typography using `clamp()`

## Testing & Linting

No test framework or linter is configured. Verify changes by running `npm run build` to ensure the project compiles without errors.

## CI/CD

Push to `main` triggers GitHub Actions (`.github/workflows/deploy.yml`):
1. Installs dependencies with `npm ci`
2. Builds with `npm run build`
3. Deploys `dist/` to GitHub Pages

Node.js v20 is used in CI.
