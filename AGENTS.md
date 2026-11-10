# Game development and publication

This repository is the canonical source for 「魔王軍にも入国審査があるってこと！？」.
The user requested continued development in the current conversation and publication through GitHub Pages.

- Edit `dist/` for the game, plus relevant tests. `docs/` is generated; do not edit it directly.
- Public game: https://okasinomatioka.github.io/maou-border-inspection/
- Repository: https://github.com/okasinomatioka/maou-border-inspection
- Publishing source: `main`, `/docs`, branch-based GitHub Pages. Do not switch to a custom Actions workflow unless needed.
- For authorized game changes, implement and verify them, then run `npm run publish:pages -- "Describe the change"`. It tests, prepares docs, commits, and pushes. It will stop if remote history has advanced; reconcile without force-pushing.
- If you already ran the appropriate tests and build with unchanged inputs, commit and push those verified files directly rather than repeating tests through the helper.
- Poll the repository Pages build/deployment status until successful. Check the public page when the hosting configuration or asset paths change. A push alone is not deployment confirmation.
- Preserve the repository visibility and existing URL. Do not add credentials, private account data, Sites metadata, or unrelated files to this public repository.
- The previous ChatGPT Sites URL is a legacy copy. The user's requested destination is GitHub Pages; do not publish new changes to Sites unless explicitly requested.
- Existing local browser tests use Playwright. Unit tests use Node's built-in test runner and need no dependencies.
- Browser saves use localStorage and are isolated by origin. Saves on the old Sites URL do not automatically transfer to the GitHub Pages URL.
