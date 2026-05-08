# zyqral

Zyqral Agentic control-plane scaffold.

## Components

- Cloudflare Worker dispatcher: `src/worker.js`
- Delegation manifest (GitHub Pages): `docs/delegation-manifest.json`
- GitHub Pages control index: `docs/index.html`

## Worker Environment Variables

- `TASK_MANIFEST_URL`: URL to delegation manifest JSON served via GitHub Pages.
- `PROVIDER_SECRETS_JSON`: JSON object keyed by provider id for bearer tokens/API keys.

Example:

```json
{"google-free-tier":"YOUR_API_KEY"}
```
