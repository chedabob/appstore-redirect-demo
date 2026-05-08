import { test, expect, devices } from '@playwright/test';

const IOS_URL = 'https://apps.apple.com/gb/app/gogo-game-arranger/id6738794421';
const ANDROID_URL = 'https://play.google.com/store/apps/details?id=com.gogogamearranger.app';
const FALLBACK_URL = 'https://gogogamearranger.com/';

async function getRedirect(page) {
  const res = await page.request.fetch('/', { maxRedirects: 0 });
  return { status: res.status(), location: res.headers()['location'] };
}

const deviceCases = [
  { label: 'iPhone 15',   device: devices['iPhone 15'],  expected: IOS_URL },
  { label: 'iPad Pro 11', device: devices['iPad Pro 11'], expected: IOS_URL },
  { label: 'Pixel 7',     device: devices['Pixel 7'],     expected: ANDROID_URL },
  { label: 'Galaxy S9+',  device: devices['Galaxy S9+'],  expected: ANDROID_URL },
];

for (const { label, device, expected } of deviceCases) {
  test(`${label} → correct store`, async ({ browser }) => {
    const ctx = await browser.newContext({ ...device });
    const page = await ctx.newPage();

    const { status, location } = await getRedirect(page);
    expect(status).toBe(302);
    expect(location).toBe(expected);

    await ctx.close();
  });
}

test('desktop browser → fallback site', async ({ browser }) => {
  const ctx = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
  });
  const page = await ctx.newPage();

  const { status, location } = await getRedirect(page);
  expect(status).toBe(302);
  expect(location).toBe(FALLBACK_URL);

  await ctx.close();
});

test('bot UA → fallback site', async ({ browser }) => {
  const ctx = await browser.newContext({
    userAgent: 'Googlebot/2.1 (+http://www.google.com/bot.html)',
  });
  const page = await ctx.newPage();

  const { status, location } = await getRedirect(page);
  expect(status).toBe(302);
  expect(location).toBe(FALLBACK_URL);

  await ctx.close();
});
