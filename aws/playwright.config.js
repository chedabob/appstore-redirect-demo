import { defineConfig } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8788';

export default defineConfig({
  testDir: './tests/e2e',
  // Skip the local server when testing against a deployed URL.
  webServer: process.env.BASE_URL ? undefined : {
    command: 'node tools/local-server.js',
    port: 8788,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  use: {
    baseURL: BASE_URL,
  },
});
