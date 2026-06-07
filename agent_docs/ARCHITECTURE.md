# Architecture

## Purpose
Redirect visitors to the correct app store (or marketing site fallback) based on their
`User-Agent` header. Three deployment targets are provided as separate sub-projects.

## Redirect targets
| Platform | URL |
|----------|-----|
| iOS (iPhone / iPad / iPod) | https://apps.apple.com/gb/app/gogo-game-arranger/id6738794421 |
| Android | https://play.google.com/store/apps/details?id=com.gogogamearranger.app |
| Fallback | https://gogogamearranger.com/ |

## Detection logic
User-agent string is matched (case-insensitive) in this order:
1. Contains `iphone`, `ipad`, or `ipod` → iOS App Store
2. Contains `android` → Google Play Store
3. Anything else (desktop, bot, unknown) → fallback

Known edge case: iPadOS 13+ in "Request Desktop Website" mode sends a macOS UA. No
library solves this — the browser intentionally lies. Accepted limitation.

---

## Variant: `cloudflare/`

Cloudflare Worker (ES module).

| File | Purpose |
|------|---------|
| `src/index.js` | Worker entry point; exports `getRedirectUrl` for unit testing |
| `wrangler.toml` | Wrangler v3 configuration |
| `package.json` | Wrangler, Vitest, Playwright dev deps |
| `vitest.config.js` | Vitest config |
| `playwright.config.js` | Playwright config — starts `wrangler dev` on port 8787 |
| `tests/unit/worker.test.js` | Unit tests (Vitest) |
| `tests/e2e/redirect.spec.js` | Device-spoofing E2E tests (Playwright) |

### Deploy
```bash
cd cloudflare
npm install
npx wrangler login   # first time only
npm run deploy
```

---

## Variant: `firebase/`

Firebase Hosting + Cloud Functions v2 (Node 20, ESM).

All requests to the hosting URL are rewritten to a single Cloud Function that reads the
UA and issues the redirect.

| File | Purpose |
|------|---------|
| `functions/redirect.js` | Pure redirect logic (no Firebase SDK) — imported by function and tests |
| `functions/index.js` | Firebase Function entry point |
| `functions/package.json` | `firebase-functions` dependency, Node 20, ESM |
| `firebase.json` | Hosting rewrites + emulator port config |
| `.firebaserc` | Project ID (update before deploying) |
| `public/.gitkeep` | Required by Firebase Hosting |
| `package.json` | Vitest, Playwright, firebase-tools dev deps |
| `vitest.config.js` | Vitest config |
| `playwright.config.js` | Playwright config — starts Firebase emulator on port 5000 |
| `tests/unit/function.test.js` | Unit tests (Vitest) — imports redirect.js directly, no SDK needed |
| `tests/e2e/redirect.spec.js` | Device-spoofing E2E tests (Playwright) |

### Deploy
```bash
cd firebase
npm install
cd functions && npm install && cd ..
# Edit .firebaserc — set your Firebase project ID
firebase login        # first time only
npm run deploy
```

---

## Variant: `aws/`

AWS CloudFront Function (JS runtime 2.0), fronted by an existing CloudFront + S3 stack.

The function runs on the **viewer-request** event. Requests to `/store` are redirected
based on `User-Agent`; everything else returns the request object unchanged and CloudFront
serves it from S3 as normal.

No IAM role, no Lambda infrastructure — just a few KB of JS associated with a cache behaviour.

| File | Purpose |
|------|---------|
| `src/redirect.mjs` | Pure UA-sniffing logic (ESM) — imported by tests |
| `src/function.js` | Self-contained CloudFront Function (no imports — CF runtime has no module system); this is what gets deployed |
| `tools/local-server.js` | Dev/test-only HTTP server — wraps `redirect.mjs` so Playwright can drive it locally |
| `tools/deploy.mjs` | Creates/updates the CF Function, publishes it, prints the ARN to associate |
| `package.json` | Vitest, Playwright dev deps |
| `vitest.config.js` | Vitest config |
| `playwright.config.js` | Playwright config — starts the local server on port 8788 |
| `tests/unit/handler.test.js` | Unit tests (Vitest) — imports `redirect.mjs` directly |
| `tests/e2e/redirect.spec.js` | Device-spoofing E2E tests (Playwright) |

### CF Function constraints
- **No module system** — `src/function.js` must be self-contained. The UA logic is inlined
  there; `redirect.mjs` is the canonical copy used by tests.
- **No environment variables** — URLs are hardcoded (same as the other variants).
- CloudFront must attach a **published** function — `deploy.mjs` handles the publish step.
- CloudFront Functions are global; no region flag needed.

### Deploy
```bash
cd aws
npm install
npm run deploy   # create-or-update + publish; prints ARN on first and subsequent runs
```

Associate the printed ARN with a **viewer-request** trigger on the CloudFront behaviour
(Console → Distribution → Behaviours → Edit → Function associations, or via IaC), then
deploy the distribution.

---

## Testing

### Unit tests (both variants)
```bash
cd cloudflare && npm test
cd firebase && npm test
cd aws && npm test
```

### E2E tests (Playwright)
Requires browser binaries on first run:
```bash
npx playwright install --with-deps
```
Then:
```bash
cd cloudflare && npm run test:e2e
cd firebase && npm run test:e2e
cd aws && npm run test:e2e
```
Playwright starts the dev server automatically, spoofs device user-agents using
built-in device descriptors (iPhone 15, iPad Pro 11, Pixel 7, Galaxy S9+), and
intercepts external redirect targets so tests never hit Apple/Google servers.
