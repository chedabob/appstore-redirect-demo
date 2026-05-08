import { defineConfig } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

export default defineConfig({
  testDir: './tests/e2e',
  // Skip local emulator when testing against a deployed URL
  webServer: process.env.BASE_URL ? undefined : {
    command: 'firebase emulators:start --only hosting,functions',
    port: 5000,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  use: {
    baseURL: BASE_URL,
  },
});
