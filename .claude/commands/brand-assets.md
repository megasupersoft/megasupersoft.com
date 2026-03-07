Regenerate brand assets and push to all social platforms. This is the full end-to-end workflow for when the logo or site design changes.

Steps:
1. Check if the dev server is running (port 5173). If not, start it in the background with `npm run dev` and wait for it to be ready.
2. Run `node screenshot.mjs` to regenerate all brand assets (logo-square, banner-x, banner-youtube, og-image — dark/light variants).
3. Report which files changed.
4. Ask the user if they want to push to socials now. If yes, run `npm run update-socials` (all platforms). Requires .env credentials — if missing, run `npm run env:pull` first.
5. Remind the user that GitHub org avatar must be uploaded manually at https://github.com/organizations/megasupersoft/settings/profile

Arguments: $ARGUMENTS
If arguments include --no-socials, skip steps 4-5.
If arguments include specific platforms (--x, --bluesky, --youtube, --github), only push to those.