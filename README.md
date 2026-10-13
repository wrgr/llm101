# LLM101 has moved to Capability Matters

The maintained LLM101 explorer, lessons and accessibility controls are now in [wrgr/capabilitymatters](https://github.com/wrgr/capabilitymatters/tree/main/experiments/llm101), served at [capabilitymatters.org/llm101/explorer/](https://capabilitymatters.org/llm101/explorer/). The contextual learning page is [capabilitymatters.org/llm101/](https://capabilitymatters.org/llm101/).

This repository no longer builds or serves the old LLM101 React app. Its root GitHub Pages URL redirects to the maintained explorer, with a native link fallback. Source history is preserved at the final old release, commit `82d4c7db64593a94ead16cdcbaa32f1459fb4d2c`. Changes to LLM101 belong in Capability Matters.

## Retained Brain101 deployment

The independent `brain101/` app remains at [wrgr.github.io/llm101/brain101/](https://wrgr.github.io/llm101/brain101/). Its source and build are unchanged. Do not disable Pages or archive this repository until Brain101 has its own agreed hosting migration. Its hosting/accessibility review is tracked in [Capability Matters issue #24](https://github.com/wrgr/capabilitymatters/issues/24).

## Build and release

`npm ci`, `npm run build`, and `npm test` verify the dependency-free root redirect. The existing Pages workflow then builds Brain101 with its own package lock and copies that output into `dist/brain101/` before deployment. The old `gh-pages` deployment shortcut was removed because it could omit the companion app. Pushes to main and manual workflow runs use the combined Pages workflow.
