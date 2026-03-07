```
  █████████  MEGA                                   █████████              ██████  █████
 ███░░░░░███                                       ███░░░░░███            ███░░███░░███
░███    ░░░ █████ ████████████   ██████  ████████ ░███    ░░░   ██████   ░███ ░░░ ███████
░░█████████░░███ ░███░░███░░███ ███░░███░░███░░███░░█████████  ███░░███ ███████  ░░░███░
 ░░░░░░░░███░███ ░███ ░███ ░███░███████  ░███ ░░░  ░░░░░░░░███░███ ░███░░░███░     ░███
 ███    ░███░███ ░███ ░███ ░███░███░░░   ░███      ███    ░███░███ ░███  ░███      ░███ ███
░░█████████ ░░████████░███████ ░░██████  █████    ░░█████████ ░░██████   █████     ░░█████
 ░░░░░░░░░   ░░░░░░░░ ░███░░░   ░░░░░░  ░░░░░      ░░░░░░░░░   ░░░░░░   ░░░░░       ░░░░░
                      ░███
                      █████
                     ░░░░░
```

**Local-first software and games. Made with care in New Zealand.**

[megasupersoft.com](https://megasupersoft.com) | [X](https://x.com/megasupersoft) | [YouTube](https://www.youtube.com/@megasupersoftware) | [Bluesky](https://bsky.app/profile/megasupersoft.bsky.social)

---

## Software

All open source. All local-first. Your data stays on your machine.

**FFFFinance** — Personal finance for New Zealand. Bank-connected, AI-powered, 20+ themes.
[Docs](https://ffffinance.org) | [GitHub](https://github.com/DangerDrome/FFFFinance_app) | [Downloads](https://megasupersoft.com/downloads)

**OpenComp** — Open-source image compositor for VFX artists. Node-based compositing without the complexity tax.

**NodeUI** — A multimedia canvas for creative work. Images, video, audio, data — connected in a node-based interface.

**FileUI** — Cross-platform file browser for artists and content creators. Browse and organise assets the way your brain works.

## Games

**Vampire Runners** — 2D roguelike arcade. Fast, chaotic, replayable. Coming to Steam.

**Renegade Cop** — 3D single-player adventure RPG. One cop. No backup. Bad decisions.

**NeverEverland** — Isometric Zelda-like adventure. Don't think too hard about what the name means.

---

## Development

This repo is the source for [megasupersoft.com](https://megasupersoft.com), built with [VitePress](https://vitepress.dev).

```bash
npm install
npm run dev              # dev server at localhost:5173
npm run build            # production build
```

### Brand assets

```bash
npm run dev              # start dev server first
node screenshot.mjs      # regenerate all brand assets
```

### Update social media graphics

```bash
npm run env:pull         # pull credentials from Cloudflare KV
npm run update-socials   # push brand assets to X, Bluesky, YouTube
```

---

```
hello@megasupersoft.com
```
