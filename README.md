# Ali Zain — Portfolio

A responsive portfolio for Ali Zain, a student developer and AI builder. Built with React 18, TypeScript, Vite 8, Three.js and GSAP, with a dark visual identity and an optional animated 3D character.

Live site: [az201214.github.io/My-Portfolio](https://az201214.github.io/My-Portfolio/). Local changes are not live until separately published.

## What’s included

Clear project and contact actions, an accessible project carousel, a downloadable résumé, optimized WebP previews, canonical/social metadata, and keyboard-friendly navigation. The essential page works independently of WebGL and model downloads. Reduced-motion visitors receive static content without downloading the optional character bundle.

The 3D scene releases its renderer, animation frame, listeners, timers, textures and scoped animation timelines when unmounted. Main content does not wait indefinitely for the model.

## Run locally

Use Node.js **22.12+**, preferably Node 24, and npm.

```bash
npm ci
npm run dev
```

Open the URL printed by Vite, including the `/My-Portfolio/` base path. This base matches the GitHub Pages repository deployment.

## Validate changes

```bash
npx playwright install chromium
npm run check
npm audit
```

On a fresh Linux CI environment, use `npx playwright install --with-deps chromium`.

| Command | Purpose |
| --- | --- |
| `npm run lint` | ESLint checks |
| `npm test` | Model compatibility, SEO, optimized assets, résumé tooling and CI regressions |
| `npm run build` | TypeScript project check and production build |
| `npm run check:links` | Check built local assets under the GitHub Pages base; not an external-link availability monitor |
| `npm run test:e2e` | Chromium desktop/mobile interactions, failure recovery, keyboard checks, automated accessibility and successful 3D loading |
| `npm run check` | Run the checks above in sequence |
| `npm run preview` | Serve the built site locally |
| `npm run resume:pdf` | Generate `public/Ali_Zain_Resume.pdf` from `resume.html` |

Browser reports are written to `playwright-report/`; failure traces/screenshots are under `test-results/`. These generated files are ignored. Automated accessibility checks complement, but do not replace, testing with assistive technology and real devices.

## Edit content and assets

- Main sections: `src/components/Landing.tsx`, `About.tsx`, `WhatIDo.tsx`, `Career.tsx`, `Work.tsx`, and `Contact.tsx`.
- Project previews: `public/images/*.webp`. Keep imports in `Work.tsx` in sync.
- Résumé: edit `resume.html`, then run `npm run resume:pdf`. `build-resume.cjs` is an alternative programmatic source generator; inspect its template before using it because it replaces the HTML too. Both scripts use the declared Playwright dependency and support optional `CHROME_PATH`.
- Canonical/social metadata: `index.html`, `public/sitemap.xml`, `public/robots.txt` and `public/og-image.jpg`.
- 3D scene and lifecycle: `src/components/Character/`. The existing model is preserved.
- `FormBridge` is Ali Zain's project for making scholarship applications more organized. Built with HTML, CSS and JavaScript, it offers a guided preparation checklist and application-question helper. Its card links to the [live demo](https://formbridge-october.vercel.app/); no public repository link is confirmed or displayed.

### Model tooling

```bash
node scripts/encrypt-model.cjs path/to/character.glb
```

This produces `public/models/character.enc` in the format expected by the loader. The shared public password is **asset obfuscation, not security or access control**. A regression test checks that the shipped model actually decrypts to a valid binary glTF. Do not put private assets or secrets into a public client bundle.

## Deployment

The workflow validates pull requests. Future pushes to `main`, or manual workflow dispatch, can deploy to GitHub Pages **only after** lint, tests, build, local-asset checks, browser checks and the dependency-audit gate pass. This requires Pages to be configured for GitHub Actions in the repository.

For another hosting path, update Vite’s `base` and the canonical/social/sitemap URLs together. Source control excludes `dist/`, local dependencies, browser reports and TypeScript build metadata.

## License

Project source is available under the [MIT License](LICENSE). Third-party packages and media retain their respective licenses; the project license does not replace those terms.
