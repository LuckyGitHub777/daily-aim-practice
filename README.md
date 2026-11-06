# Daily Aim — One Meaningful Move

A small, local-first daily practice for turning one meaningful aim into an action, recording what actually happened, and learning from the result. This **standalone static edition** is not a hosted account service or the full multiroute web application.

## Use

Requires a current Python 3 environment for the local static server, and a modern browser. From this directory run `python -m http.server 8000`, then open `http://127.0.0.1:8000/`. Enter your aim, reason, next move, observed result and evidence. Export JSON or Markdown to keep a record; import your JSON later when useful.

The interface keeps information **only in the current tab memory** until you explicitly export. It has no analytics, account, cloud sync, background transmission or automatic browser storage. Do not enter sensitive information on an untrusted shared device. Exports are ordinary, unencrypted files under the user's control. No action, achievement, health, financial or psychological outcome is guaranteed.

## Check

Run `node --test tests/test_practice.mjs` with Node.js 20+ to verify the local practice model. Run `python -m unittest discover -s tests -v` for the source manifest and bundled link checks. The underlying model lives in [lib/practice.mjs](lib/practice.mjs), and all dependencies are local to this edition.

## Rights and evidence

The included MIT [LICENSE](LICENSE) and required [third-party notices](THIRD_PARTY_NOTICES.md) are preserved. The [claims and safety boundary](docs/CLAIMS_AND_SAFETY.md) explains appropriate educational use. [MANIFEST.sha256](MANIFEST.sha256) provides exact file hashes. This is a practice interface, not evidence of improved outcomes.
