# megasupersoft.com

Nuxt 4 + NuxtHub full-stack app on Cloudflare. Public marketing site + auth-protected dashboard for managing socials, analytics, brand assets, and releases.

## Commands

```bash
npm run dev            # dev server at localhost:3000
npm run build          # production build
npm run preview        # preview production build locally
npm run update-socials # push brand assets to social platforms (see .env.example)
npm run env:pull       # download .env from Cloudflare KV
npm run env:push       # upload .env to Cloudflare KV
```

Brand asset regeneration: use `/brand-assets` command (regenerates PNGs + pushes to socials)

## Architecture

- **Framework:** Nuxt 4 (Vue 3, Nitro server)
- **Hosting:** Cloudflare Pages + Workers
- **Database:** Cloudflare D1 (SQLite at edge)
- **KV Store:** Cloudflare KV (secrets, cache)
- **Blob Storage:** Cloudflare R2
- **Auth:** GitHub OAuth via nuxt-auth-utils
- **Content:** Nuxt Content v3 (markdown in `content/`)

## Key paths

- `nuxt.config.ts` — app config, modules, head meta, runtime config
- `content.config.ts` — Nuxt Content collection definitions
- `wrangler.jsonc` — Cloudflare Workers bindings (D1, KV)
- `app/` — Nuxt app directory
  - `app/pages/` — file-based routing (public site + `/dashboard`)
  - `app/components/` — Vue components (AsciiHero, SiteNav, SiteFooter, etc.)
  - `app/layouts/` — default (public) and dashboard layouts
  - `app/assets/css/` — theme variables, animations
  - `app/composables/` — shared composables (useColorMode, etc.)
- `content/` — markdown pages (about, products, downloads, privacy, terms, presskit)
- `server/` — Nitro server routes
  - `server/api/` — API endpoints (posts, etc.)
  - `server/routes/auth/` — OAuth handlers
  - `server/database/migrations/` — D1 schema migrations
- `public/brand/` — brand assets (PNG), dark/light variants
- `scripts/update-socials.mjs` — push brand assets to social platforms
- `screenshot.mjs` — generate brand assets via Playwright

## Secrets & infrastructure

- Cloudflare account: Danger Ltd (`13c756aa86b04a8c3067cf111a3f29b1`)
- KV namespace: `megasupersoft-secrets` (id: `69be302ab7dd42c99affa0aec62480b4`)
- Credentials stored in `.env` (gitignored), backed up to Cloudflare KV via `env:pull`/`env:push`
- Social platforms: X (@megasupersoft), YouTube (@megasupersoftware), Bluesky (@megasupersoft.bsky.social), GitHub (megasupersoft org — avatar is manual-only)

## Conventions

- ESM throughout (`"type": "module"`)
- Zero external dependencies for utility scripts (use Node built-ins: fetch, crypto, fs)
- Brand assets use dark variant by default
- Playwright is a devDependency (screenshot generation only)
- No formatter/linter configured — keep code style consistent with existing files
- Dashboard pages use `definePageMeta({ layout: 'dashboard' })`
- Server routes in `server/api/` require auth via `getUserSession(event)`

## Workflow rules

- ALWAYS search (Grep/Glob) before creating new files or functions — check if something similar exists
- ALWAYS read a file before editing it — never edit blind
- When modifying a Vue component or config, check for references in other files first
- Keep changes minimal — don't over-engineer
- Verify builds pass: `npm run build` after structural changes
- Do not commit `.env` or any credentials
- NEVER add `Co-Authored-By` or any AI attribution to commit messages — the user is the sole author
