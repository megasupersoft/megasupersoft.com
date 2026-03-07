# megasupersoft.com

VitePress corporate site for MegaSuperSoft.

## Commands

```bash
npm run dev            # dev server at localhost:5173
npm run build          # production build to .vitepress/dist
npm run update-socials # push brand assets to social platforms (see .env.example)
npm run env:pull       # download .env from Cloudflare KV
npm run env:push       # upload .env to Cloudflare KV
```

Brand asset regeneration: `npm run dev` then `node screenshot.mjs`

## Key paths

- `.vitepress/config.ts` — site config, nav, social links, head meta
- `.vitepress/theme/Layout.vue` — custom layout wrapper
- `.vitepress/theme/components/` — Vue components (SiteFooter, etc.)
- `.vitepress/theme/styles/` — CSS
- `public/brand/` — brand assets (PNG + SVG), dark/light variants
- `scripts/update-socials.mjs` — push brand assets to social platforms
- `screenshot.mjs` — generate brand assets via Playwright

## Secrets & infrastructure

- Cloudflare account: Danger Ltd (`13c756aa86b04a8c3067cf111a3f29b1`)
- KV namespace: `megasupersoft-secrets` (id: `69be302ab7dd42c99affa0aec62480b4`)
- Credentials stored in `.env` (gitignored), backed up to Cloudflare KV via `env:pull`/`env:push`
- Social platforms: X (@megasupersoft), YouTube (@megasupersoftware), Bluesky (@megasupersoft.bsky.social), GitHub (megasupersoft org — avatar is manual-only)

## Conventions

- ESM throughout (`"type": "module"`)
- Zero external dependencies for scripts (use Node built-ins: fetch, crypto, fs)
- Brand assets use dark variant by default
- Playwright is a devDependency (screenshot generation only)
- No formatter/linter configured — keep code style consistent with existing files

## Workflow rules

- ALWAYS search (Grep/Glob) before creating new files or functions — check if something similar exists
- ALWAYS read a file before editing it — never edit blind
- When modifying a Vue component or config, check for references in other files first
- Keep changes minimal — this is a simple static site, don't over-engineer
- Verify builds pass: `npm run build` after structural changes
- Do not commit `.env` or any credentials
- NEVER add `Co-Authored-By` or any AI attribution to commit messages — the user is the sole author
