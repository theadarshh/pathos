# PathOS

**EXPLORE WHAT'S NEXT.**

PathOS is an interactive career intelligence experience that transforms your experience, skills and ambitions into a visual map of possible futures. Enter your role, experience, skills and goal, and PathOS builds a personalized Career Universe of what you stand, which paths fit you, what to learn next, and a 90-day journey to get there.

This is a fully standalone web app — it does not require any Claude/Anthropic runtime, API, or proprietary service to run. Everything (scoring, recommendations, PathOS Intelligence) runs client-side with deterministic, transparent logic.

## Overview

PathOS walks a user through a cinematic hero → guided onboarding → a personalized dashboard with: Career DNA, Career Universe, Skill Gap, Learn Next, Compare Paths, 90-Day Journey, What-If Simulator, Project Builder, and PathOS Intelligence.

Every number and recommendation shown is calculated from the user's actual onboarding answers — nothing is hardcoded per profile. See `src/utils/scoring.js` for the documented readiness and match-score algorithms.

## Features

- **Cinematic hero** with a mouse-reactive animated career-node network (canvas)
- **4-step onboarding** — role, experience, skills, goal — with working selection, deselection, back/continue, and an editable profile flow
- **Building sequence** — short animated transition into the app
- **Career DNA** — animated readiness ring, current/emerging strength, opportunity area, all derived from profile data
- **Career Universe** — an interactive SVG constellation of career paths (Development, Cloud, DevOps, SRE, Platform, AI, Data, Security) around the user's current role, with hover/click states, keyboard interaction, dimming of unrelated nodes, and connection strength tied to match score
- **Path Detail** — a contextual panel for the selected path, with a shortcut into Skill Gap
- **Skill Gap Visualizer** — per-category orbit-style completion rings with COMPLETE / RECOMMENDED / LATER states
- **Learn Next** — a dynamic bridge from the user's role to a target path, with KNOWN / NEXT / LATER / TARGET state badges and clickable skill explanations
- **Compare Paths** — side-by-side comparison of up to 3 paths (qualitative alignment/complexity only — no fabricated salary or employment claims)
- **90-Day Journey** — a scroll-driven, goal-specific FOUNDATION → BUILD → PROVE roadmap that skips skills the user already knows
- **What-If Simulator** — a causal sequence (skill enters → connections form → landscape resolves) that recalculates career-path relevance live, without touching the saved profile
- **Project Builder** — generates a portfolio project concept (architecture, skills demonstrated, milestones, difficulty) from your target path and current skill gap
- **PathOS Intelligence** — a deterministic, keyword-based local advice engine (no external API) whose recommendations highlight the relevant skill in Skill Gap and the relevant path in Career Universe
- **Command Palette** (Cmd/Ctrl+K) — jump to any view or action by keyboard
- **localStorage persistence** — refreshing the page keeps the user's profile; Edit Profile revises it in place, Restart clears it
- Responsive across desktop / tablet / mobile, with `prefers-reduced-motion` support throughout

## Tech Stack

- React 18
- Vite 5
- Plain CSS (custom properties for theming — palette, spacing, type, motion and radius tokens — no framework) — kept deliberately dependency-light
- Canvas + SVG for the visualizations (no charting library needed)

## Project Structure

```
pathos/
  index.html
  package.json
  vite.config.js
  src/
    main.jsx              # React entry point
    App.jsx                # Screen orchestration (hero → onboarding → building → app)
    data/                  # Static reference data (roles, skills, career paths, roadmap seeds, demo profile)
    utils/                 # Pure logic: scoring, skill gap, roadmap generation, project builder, PathOS Intelligence
    hooks/                 # localStorage persistence
    components/            # One folder per view, each with its own component + scoped CSS
    styles/globals.css     # Design tokens (palette/spacing/type/motion/radius) and shared UI classes
```

Data is kept separate from UI, and calculation logic (`utils/`) is kept separate from rendering (`components/`) so the app stays maintainable as it grows.

## Local Setup

```bash
npm install
npm run dev
```

Then open **http://localhost:5173**.

### Windows

Works the same way from a Windows path, e.g.:

```bat
cd /d D:\Projects\2\pathos
npm install
npm run dev
```

Then open http://localhost:5173 in a browser. No Claude/Anthropic runtime, sandbox path, or environment variable is required — this is a plain Vite + React project.

## Testing

```bash
npm test
```

Runs `logic.test.mjs`, a lightweight custom test script (no Jest/Vitest dependency) that exercises the deterministic scoring, roadmap, skill-gap and PathOS Intelligence logic directly.

## Production Build

```bash
npm run build
```

Outputs a static, deployable bundle to `dist/`.

## Preview

```bash
npm run preview
```

Serves the production build locally so you can verify it before deploying.

## Deployment

The build output (`dist/`) is a static site and can be deployed anywhere that serves static files.

**Vercel**
- Import the repo at vercel.com, or run `npx vercel`
- Framework preset: Vite (auto-detected)
- Build command: `npm run build` · Output directory: `dist`
- No environment variables, backend, or SPA fallback rule are required — PathOS has no client-side router, so there are no deep-linkable sub-routes that need a rewrite rule.

**Netlify**
- `npx netlify deploy --build`, or connect the repo in the Netlify dashboard
- Build command: `npm run build` · Publish directory: `dist`

**Render**
- Create a new **Static Site**, connect the repo
- Build command: `npm run build` · Publish directory: `dist`

## PathOS Intelligence

`src/utils/careerCoach.js` is intentionally isolated from all UI code. It exposes one function:

```js
getCareerAdvice(question, profile) // -> { targetPath, score, why, have, next, action }
```

Today it matches keywords in the question (cloud, ai, devops, data, security, etc.) against the user's profile and returns a structured, concise recommendation, which `App.jsx` also uses to highlight the relevant skill in Skill Gap and the relevant path in Career Universe. To connect a real AI backend later, keep the same function signature and replace the body with a call to your own backend endpoint (never call a model provider directly from client-side code, and never embed an API key in frontend code).

## Known Limitations

- PathOS Intelligence is a deterministic keyword-matcher, not a real language model — it covers the question patterns described in the spec but won't handle arbitrary free-text questions gracefully.
- Career path data (skills, projects, reasons) covers eight IT career paths across Development, Cloud, DevOps, AI, Data and Security; it's a static reference dataset, not a live labor-market feed.
- No automated end-to-end browser test suite is included; the app was verified via a production build, static analysis, and direct unit tests of the scoring/roadmap/skill-gap/coach logic (see `logic.test.mjs`). Rendered visual verification in a real browser was not performed in the environment this project was built in.
