# zyqral

Zyqral Agentic control-plane scaffold.

## Components

- Cloudflare Worker dispatcher + control API: `src/worker.js`
- Delegation manifest (GitHub Pages): `docs/delegation-manifest.json`
- Public front page: `docs/index.html`
- Operator control console: `docs/zyqral-control.html`

## Worker Environment Variables / Bindings

- `TASK_MANIFEST_URL`: URL to delegation manifest JSON served via GitHub Pages.
- `PROVIDER_SECRETS_JSON`: JSON object keyed by provider id for bearer tokens/API keys.
- `CONTROL_SECRET`: shared secret required for `/control/*` operations.
- `CONTROL_KV`: KV binding for control/config data.
- `CONTROL_DB`: D1 binding for query/update operations.

Example `PROVIDER_SECRETS_JSON`:

```json
{"google-free-tier":"YOUR_API_KEY"}
```
