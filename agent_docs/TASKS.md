# Tasks

## Status legend
- [ ] todo
- [x] done

## Cloudflare variant
- [x] `cloudflare/src/index.js` — worker + exported `getRedirectUrl`
- [x] `cloudflare/wrangler.toml`
- [x] `cloudflare/package.json`
- [x] `cloudflare/vitest.config.js`
- [x] `cloudflare/playwright.config.js`
- [x] `cloudflare/tests/unit/worker.test.js`
- [x] `cloudflare/tests/e2e/redirect.spec.js`
- [ ] Deploy (user: `cd cloudflare && npm i && npx wrangler login && npm run deploy`)

## Firebase variant
- [x] `firebase/functions/redirect.js` — pure logic, no SDK
- [x] `firebase/functions/index.js` — Firebase Function entry point
- [x] `firebase/functions/package.json`
- [x] `firebase/firebase.json`
- [x] `firebase/.firebaserc` — update project ID before deploying
- [x] `firebase/package.json`
- [x] `firebase/vitest.config.js`
- [x] `firebase/playwright.config.js`
- [x] `firebase/tests/unit/function.test.js`
- [x] `firebase/tests/e2e/redirect.spec.js`
- [ ] Update `.firebaserc` with real project ID
- [ ] Deploy (user: `cd firebase && npm i && cd functions && npm i && cd .. && firebase login && npm run deploy`)

## Cleanup
- [ ] Remove root-level `src/`, `wrangler.toml`, `package.json` (superseded by `cloudflare/`)
