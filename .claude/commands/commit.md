Create a git commit for the current changes.

1. Run `git status` and `git diff --staged` and `git diff` to understand what changed
2. If nothing is staged, stage the relevant changed files (be specific, never `git add .`)
3. Never stage `.env` or credential files
4. Write a concise commit message — focus on the "why" not the "what"
5. Follow the style of recent commits: `git log --oneline -10`
6. NEVER include Co-Authored-By lines or any AI attribution
7. Show the commit result

If given arguments, use them as the commit message: $ARGUMENTS