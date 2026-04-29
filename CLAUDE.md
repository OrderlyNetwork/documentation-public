# Documentation Repo Rules

## PR-Only Workflow (MANDATORY)

**NEVER push directly to `main`.** Always:

1. Create a feature branch: `git checkout -b docs/<descriptive-name>`
2. Make changes and commit
3. Push the branch: `git push -u origin docs/<descriptive-name>`
4. Create a PR for review

## Git Remote

This repo uses SSH Host `github-company` (GitHub account: `orderly-chiwei`).
Remote URL must be: `git@github-company:OrderlyNetwork/documentation.git`

## Framework

- Mintlify docs (`docs.json` is the main config)
- Content in `.mdx` files
- Local preview: `yarn dev` → http://localhost:3000
- Redirects: `docs.json` → `redirects` array
- SDK release notes: `release-notes/sdk.mdx`
