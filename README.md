# How LLMs actually work — a depth-adjustable explainer

An interactive explainer for generative AI and large language models. **One
mechanism, five views, two arcs.** A reader chooses how deep to go (from a
single metaphor to the formal account), and the content is assembled on the fly
from tagged segments.

This repository is a **working architecture with one fully-authored module**
(01, *Prediction*). The remaining modules are correctly-structured scaffolds
with objectives, tags, and citations in place, ready to be authored in Claude
Code. See `AUTHORING.md`.

## Run it

```bash
npm install
npm run dev        # local dev server
npm run build      # production build to dist/
npm run preview    # preview the production build
```

Node 18+ recommended.

## What's implemented

- **Five-view slider** with aligned dots/labels and full keyboard support.
- **Sparse segment engine**: each module is an ordered set of *beats* tagged by
  role, arc, and the view range they apply to. The "talk" at any view is just
  the beats valid there, so novices get scaffolds and experts get the formal
  account without re-reading.
- **Two arcs** — *How it works* (00–08) and *What it means* (09–14) — with an
  arc filter in the sidebar.
- **Glossary popovers**: click any `[[term]]` for a definition; one shared
  glossary, level-independent.
- **KaTeX math** in formal beats (`$inline$`, `$$display$$`).
- **Optional checks** for understanding per module (ungraded).
- **Reference tab** organized by topic, and a **Pedagogy tab** explaining the
  design, each with citations.

## Grounding

Two separate citation layers, deliberately:

- **Content** (what an LLM is/does) is grounded in primary ML/NLP literature,
  per module.
- **Design** (five views, fading scaffolds, checks) is grounded in the learning
  sciences — see the Pedagogy tab and the Reference tab's "Pedagogy & design"
  section. No program-specific citations are used.

> Citation metadata is **seeded** for the build. Run a verification pass
> (Crossref / arXiv / DOI) before publishing. Mechanistic-arc sources (00–08)
> were drawn from verified canonical papers; meaning-arc modules (09–14) list
> *candidate* sources in code comments to verify.

## Deploy to GitHub Pages

`vite.config.js` uses `base: "./"` (relative paths), which works on a project
site at `https://USER.github.io/REPO/` without further config.

**Option A — one command (gh-pages branch):**

```bash
npm run deploy     # builds and pushes dist/ to the gh-pages branch
```

Then in the repo: Settings → Pages → Source: `gh-pages` branch.

**Option B — GitHub Actions:** a workflow is included at
`.github/workflows/deploy.yml`. Push to `main`, then set Settings → Pages →
Source: *GitHub Actions*.

If you deploy to a path and assets 404, set `base: "/your-repo-name/"` in
`vite.config.js` instead of `"./"`.

## Project map

```
src/
  App.jsx                 shell: top nav, level + arc state, layout, popover host
  index.css               design tokens, per-view accent, responsive layout
  data/
    levels.js             the five views, beat roles, arcs
    glossary.js           shared term definitions ([[key]] -> popover)
    modules.js            all 15 modules (01 authored; rest scaffolded)
    pedagogy.js           design principles + their citations
  components/
    LevelSlider.jsx       aligned custom slider
    Sidebar.jsx           arc-grouped nav + arc filter
    ModuleView.jsx        assembles the talk from valid beats
    Beat rendering        (inside ModuleView)
    Check.jsx             optional question
    GlossaryPopover.jsx   definition card
    ReferenceTab.jsx      citations by topic
    PedagogyTab.jsx       design rationale
  lib/
    markup.jsx            parses [[terms]] and $math$ in beat bodies
```
