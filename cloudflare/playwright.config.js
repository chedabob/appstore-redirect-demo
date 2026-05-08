import { defineConfig } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8787';

export default defineConfig({
  testDir: './tests/e2e',
  // Skip local dev server when testing against a deployed URL
  webServer: process.env.BASE_URL ? undefined : {
    command: 'npx wrangler dev --port 8787',
    port: 8787,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  use: {
    baseURL: BASE_URL,
  },
});
