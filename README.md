# Ali Zain — Portfolio

**A dark, responsive developer portfolio with an optional animated 3D character, built with React, TypeScript, Three.js, and GSAP.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Deploy status](https://github.com/az201214/My-Portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/az201214/My-Portfolio/actions/workflows/deploy.yml)
[![Hosted on GitHub Pages](https://img.shields.io/badge/hosted%20on-GitHub%20Pages-222?logo=github)](https://az201214.github.io/My-Portfolio/)
[![Node.js 22.12+](https://img.shields.io/badge/node-%3E%3D22.12-339933?logo=nodedotjs&logoColor=white)](package.json)

**Live site:** [az201214.github.io/My-Portfolio](https://az201214.github.io/My-Portfolio/)

---

## About

Ali Zain is a student developer building web, mobile, and AI projects. This repository is the source for the portfolio site, a single-page experience with Landing, About, What I Do, Career, Work, and Contact sections. The character is an optional extra: the essential content works without WebGL or the 3D model download.

## Features

- **Animated 3D character:** a Three.js scene with post-processing, loaded separately from the main page. Its renderer, animation frame, listeners, timers, textures, and timelines are released when it unmounts.
- **Project carousel:** an accessible region with previous and next controls, dot navigation, a live status line, and labeled slides.
- **Accessibility:** keyboard-friendly navigation, semantic structure, labeled controls, and automated accessibility checks with axe in the browser test suite.
- **Reduced-motion support:** animations, the custom cursor, and loading effects respect `prefers-reduced-motion`. Reduced-motion visitors get static content and do not download the optional character bundle.
- **Graceful fallbacks:** if WebGL is unavailable, the 3D scene is skipped and the page still renders. An error boundary contains failures, and main content never waits indefinitely for the model.
- **Optimized assets:** project previews are WebP, and a résumé PDF is included for download.
- **SEO ready:** canonical and social metadata, a share image, `sitemap.xml`, and `robots.txt`.

## Featured projects

- **NexusInsight CRM**: TypeScript, Next.js, Supabase, B2B workspace
- **Rally**: Dart, Flutter, Firebase
- **FormBridge**: HTML, CSS, JavaScript. Ali Zain's own project that makes scholarship applications easier to organize, with a guided preparation checklist and an application-question helper. [View the live demo](https://formbridge-october.vercel.app/).
- **Meetily**: Rust, AI tooling, Whisper, Ollama (open-source contribution)

## Tech stack

| Area | Technologies |
| --- | --- |
| UI | React 18, TypeScript |
| Build and tooling | Vite 8, ESLint, TypeScript |
| Animation | GSAP |
| 3D | Three.js, React Three Fiber, Drei, postprocessing |
| Testing | Node test runner, Playwright, axe-core |
| Hosting | GitHub Pages, deployed by GitHub Actions |

## Getting started

Requirements: **Node.js 22.12+** (Node 24 is recommended and used in CI) and npm.

```bash
git clone https://github.com/az201214/My-Portfolio.git
cd My-Portfolio
npm ci
npm run dev
```

Open the URL printed by Vite, including the `/My-Portfolio/` base path. This base matches the GitHub Pages repository deployment.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server on your network |
| `npm run build` | TypeScript project check and production build |
| `npm run preview` | Serve the built site locally |
| `npm run lint` | ESLint checks |
| `npm test` | Model compatibility, SEO, optimized assets, résumé tooling and CI regressions |
| `npm run test:e2e` | Chromium desktop/mobile interactions, failure recovery, keyboard checks, automated accessibility and successful 3D loading |
| `npm run check:links` | Check built local assets under the GitHub Pages base; not an external-link availability monitor |
| `npm run check` | Run lint, tests, build, link checks and end-to-end tests in sequence |
| `npm run resume:pdf` | Generate `public/Ali_Zain_Resume.pdf` from `resume.html` |

Before running the browser tests for the first time, install the test browser:

```bash
npx playwright install chromium
```

On a fresh Linux CI environment, use `npx playwright install --with-deps chromium`. Browser reports are written to `playwright-report/`, and failure traces and screenshots go under `test-results/`. Both are generated and ignored by Git. Automated accessibility checks complement, but do not replace, testing with assistive technology and real devices.

Before publishing dependency changes, also run `npm audit`. The CI workflow blocks deployment on moderate or higher advisories.

## Editing content and assets

- **Main sections:** `src/components/Landing.tsx`, `About.tsx`, `WhatIDo.tsx`, `Career.tsx`, `Work.tsx`, and `Contact.tsx`.
- **Project previews:** `public/images/*.webp`. Keep the imports in `Work.tsx` in sync.
- **Résumé:** edit `resume.html`, then run `npm run resume:pdf`. `build-resume.cjs` is an alternative programmatic source generator. Inspect its template before using it, because it replaces the HTML too. Both scripts use the declared Playwright dependency and support an optional `CHROME_PATH`.
- **Canonical and social metadata:** `index.html`, `public/sitemap.xml`, `public/robots.txt`, and `public/og-image.jpg`.
- **3D scene and lifecycle:** `src/components/Character/`. The existing model is preserved.

### Model tooling

```bash
node scripts/encrypt-model.cjs path/to/character.glb
```

This produces `public/models/character.enc` in the format expected by the loader. The shared public password is **asset obfuscation, not security or access control**. A regression test checks that the shipped model actually decrypts to a valid binary glTF. Do not put private assets or secrets into a public client bundle.

## Project structure

```text
.
├── .github/workflows/deploy.yml   CI: validate the site, then deploy to GitHub Pages
├── public/                        Static files: WebP previews, 3D model, résumé PDF, SEO files
├── scripts/                       Model encryption and local link checker
├── src/
│   ├── components/               Page sections, navigation, and UI pieces
│   │   ├── Character/            3D character scene and lifecycle
│   │   ├── styles/               Component stylesheets
│   │   └── utils/                GSAP, text-split, and loading helpers
│   ├── context/                  Loading state provider
│   ├── data/                     Character bone name lists
│   └── types/                    Type declarations
├── tests/
│   ├── project.test.mjs          Unit and regression tests (npm test)
│   └── browser/portfolio.spec.ts Browser and accessibility tests (npm run test:e2e)
├── index.html                    Page metadata
├── resume.html                   Résumé source
├── generate-pdf.cjs              Résumé PDF generator
├── build-resume.cjs              Alternative résumé generator
├── vite.config.ts                Vite configuration (GitHub Pages base path)
└── LICENSE                       MIT License
```

## Deployment

The site is hosted on GitHub Pages. The workflow in `.github/workflows/deploy.yml` validates pull requests. Pushes to `main` (or a manual workflow run) deploy to GitHub Pages **only after** lint, tests, build, local-asset checks, browser checks, and the dependency-audit gate all pass. This requires Pages to be configured to use GitHub Actions in the repository. Local edits are not live until they are pushed to `main` and the workflow deploys them.

For another hosting path, update Vite's `base` and the canonical, social, and sitemap URLs together. Source control excludes `dist/`, local dependencies, browser reports, and TypeScript build metadata.

## Contact

- GitHub: [github.com/az201214](https://github.com/az201214)
- Portfolio: [az201214.github.io/My-Portfolio](https://az201214.github.io/My-Portfolio/). The Contact section on the site has the current ways to reach out.

## License

Project source is available under the [MIT License](LICENSE). Third-party packages and media retain their respective licenses; the project license does not replace those terms.
