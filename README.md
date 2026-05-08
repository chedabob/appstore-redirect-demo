# appstore-redirect

Serverless redirect that reads the visitor's `User-Agent` and sends them to the correct app store, or falls back to the marketing site.

| Platform | Destination |
|----------|-------------|
| iOS (iPhone / iPad / iPod) | [App Store](https://apps.apple.com/gb/app/gogo-game-arranger/id6738794421) |
| Android | [Google Play](https://play.google.com/store/apps/details?id=com.gogogamearranger.app) |
| Everything else | [gogogamearranger.com](https://gogogamearranger.com/) |

Two deployment targets are provided as independent sub-projects.

## Prerequisites

Install [mise](https://mise.jdx.dev/) then run from the repo root:

```bash
mise install
```

This pins Node 20 and installs the Google Cloud SDK for the project.

---

## Cloudflare Workers — `cloudflare/`

**Live:** `https://appstore-redirect.udidfyi.workers.dev`

### Deploy
```bash
cd cloudflare
npm install
npx wrangler login   # first time only
npm run deploy
```

### Test
```bash
# Unit tests
npm test

# E2E against local dev server
npm run test:e2e

# E2E against deployed worker
BASE_URL=https://appstore-redirect.udidfyi.workers.dev npm run test:e2e
```

---

## Firebase Hosting + Functions — `firebase/`

**Live:** `https://appstore-redirect-demo.web.app`

Requires a Firebase project on the Blaze (pay-as-you-go) plan.

### Deploy
```bash
cd firebase
npm install
cd functions && npm install && cd ..
npx firebase login   # first time only
npm run deploy
```

### Test
```bash
# Unit tests
npm test

# E2E against local emulator
npm run test:e2e

# E2E against deployed site
BASE_URL=https://appstore-redirect-demo.web.app npm run test:e2e
```

---

## License

MIT
