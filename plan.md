# Migration Plan: From Jekyll/Gulp to Astro

## Objective
Replace the current hybrid Ruby/Node build pipeline (Jekyll + Gulp) with a unified, modern Astro-based pipeline. The goal is to leverage Astro's content-centric architecture for Markdown while maintaining 100% visual parity on GitHub Pages.

## Phase 1: Audit & Preparation (Completed)
- [x] Analyze current JavaScript dependency tree (jQuery, p5, custom scripts).
- [x] Analyze Jekyll content structure (32 `.markdown` posts with complex YAML frontmatter).
- [x] Identify key Gulp tasks (concatenation, minification of `_js/` → `assets/js/`) to be replaced.
- [x] Decision: Use **Astro** as the core framework instead of plain Vite.
- [x] Decision: Keep existing SCSS (do NOT introduce Tailwind — visual parity goal makes a full CSS rewrite too risky).

## Phase 2: Cleanup & Archive (Completed)
- [x] **Archive generated assets**: Moved `assets/css/` and `assets/js/` into `_archive/assets/`.
- [x] **Delete build artifacts**: Removed `_site/`.
- [x] **Remove node_modules and lock file**: Deleted `node_modules/` and `package-lock.json`.
- [x] **Strip package.json**: Removed all existing `scripts` and `devDependencies` entries.
- [x] **Delete legacy config files**: Removed `_config.yml`, `gulpfile.js`, `Gemfile`, `Gemfile.lock`.

## Phase 3: Infrastructure Setup (Completed)
- [x] Initialized Astro 6 project with `astro.config.mjs` and `tsconfig.json`.
- [x] Configured SCSS support via Vite's `css.preprocessorOptions.scss.loadPaths` (mirrors Jekyll's sass load_paths).
- [x] Configured Astro content collections (`src/content.config.ts`) with glob loader pointing at `src/content/projects/`.
- [x] Installed and wired up JS dependencies: `jquery@4`, `p5@2`, `sass`.
- [x] Added `npm run dev`, `build`, `build:vendors`, `build:js`, `build:css` scripts.

## Phase 4: Content & Template Migration (Completed)
- [x] **Template Conversion**: Converted all `_layouts/` and `_includes/` into Astro components.
  - `src/layouts/Default.astro` — base layout (head, footer, GA, JS loading)
  - `src/pages/index.astro` — home page with project grid and tag list
  - `src/pages/tagged.astro` — tag browser
  - `src/pages/[slug].astro` — project detail pages (handles all media types, sections, cover variants)
  - `src/pages/cv.astro` — CV page
  - `src/components/Typekit.astro`, `Footer.astro`, `MediaItem.astro`
- [x] **Content Migration**: Moved 32 `_posts/*.markdown` → `src/content/projects/*.md` with date prefixes preserved for sort order; Zod schema handles Jekyll's space-separated tag format.
- [x] **Asset Re-routing**: Copied `assets/projects/`, `assets/fonts/`, `assets/img/` → `public/assets/`.
- [x] **SCSS Migration**: Moved `_sass/` → `src/styles/`; `main.scss`, `cube.scss`, `recap.scss` ported with Jekyll frontmatter removed.

## Phase 5: Implementation of Build Logic (Completed)
- [x] **JS Bundling**: `npm run build:js` concatenates `_js/tools/` into `public/assets/js/tools.min.js` and `src/scripts/` into `public/assets/js/ivaylogetov.min.js`. Replaces Gulp entirely.
- [x] **Vendor updates**: `npm run build:vendors` copies jQuery 4 and p5 2 dist files from `node_modules/` into `public/assets/js/`. No CDN dependency.
- [x] **CSS extras**: `npm run build:css` compiles `cube.scss` and `recap.scss` via Sass CLI.
- [x] **Patched custom scripts** (`src/scripts/main.js`) for jQuery 4 breaking changes:
  - `$(window).load()` → `$(window).on('load', ...)`
  - `$("body").animate({scrollTop})` → `$("html, body").animate({scrollTop})`
  - `jQuery.browser.mobile` guard added (detectmobile plugin recreates the namespace safely)
- [x] `nodeField.js` and `cube.js`: no breaking changes found for p5 2 / jQuery 4 respective usage.

## Phase 6: Verification & Deployment
- [ ] **Visual Regression Test**: Compare `dist/` output against archived `_archive/assets/` (screenshots or side-by-side diff). Delete `_archive/` once parity is confirmed.
- [ ] **GitHub Actions Setup**: Create `.github/workflows/deploy.yml` that installs Node/npm, runs `npm ci`, `npm run build`, and deploys `dist/` to GitHub Pages.
- [ ] **Final Cleanup**: Remove `_layouts/`, `_includes/`, `_posts/`, `_js/`, `_sass/`, `_misc/`, and `cv.html` once migration is verified.

## Success Criteria
- The website looks identical to the original.
- Running `npm run dev` provides a working local development environment.
- Running `npm run build` generates a production-ready `dist/` folder.
- Deployment to GitHub Pages is fully automated via a single Node command.
- No Ruby/Bundler dependency remains.
