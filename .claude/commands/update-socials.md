Push brand assets to social media platforms. Run `npm run update-socials` with any arguments: $ARGUMENTS

If no arguments given, confirm with the user which platforms to update (--x, --bluesky, --youtube, --github, or all). Requires .env credentials — if missing, run `npm run env:pull` first and report if that fails.

Note: GitHub only supports org metadata updates (description, location, URL, email). Avatar must be uploaded manually.