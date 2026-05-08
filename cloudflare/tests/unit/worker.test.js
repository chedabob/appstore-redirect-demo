import { describe, it, expect } from 'vitest';
import worker, { getRedirectUrl } from '../../src/index.js';

const IOS_URL = 'https://apps.apple.com/gb/app/gogo-game-arranger/id6738794421';
const ANDROID_URL = 'https://play.google.com/store/apps/details?id=com.gogogamearranger.app';
const FALLBACK_URL = 'https://gogogamearranger.com/';

function req(ua) {
  return new Request('https://example.com/', {
    headers: ua != null ? { 'User-Agent': ua } : {},
  });
}

describe('getRedirectUrl', () => {
  it.each([
    ['iPhone',  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',        IOS_URL],
    ['iPad',    'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)',                  IOS_URL],
    ['iPod',    'Mozilla/5.0 (iPod touch; CPU iPhone OS 16_0 like Mac OS X)',     IOS_URL],
    ['Android', 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36',   ANDROID_URL],
    ['Samsung', 'Mozilla/5.0 (Linux; Android 13; SM-G991B) SamsungBrowser/23.0', ANDROID_URL],
    ['Desktop', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/124',    FALLBACK_URL],
    ['Googlebot','Googlebot/2.1 (+http://www.google.com/bot.html)',               FALLBACK_URL],
    ['empty UA','',                                                                FALLBACK_URL],
    ['null UA', null,                                                              FALLBACK_URL],
  ])('%s → correct URL', (_label, ua, expected) => {
    expect(getRedirectUrl(ua)).toBe(expected);
  });
});

describe('worker.fetch', () => {
  it('returns 302', async () => {
    const res = await worker.fetch(req('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)'));
    expect(res.status).toBe(302);
  });

  it('sets Location header', async () => {
    const res = await worker.fetch(req('Mozilla/5.0 (Linux; Android 14; Pixel 8)'));
    expect(res.headers.get('Location')).toBe(ANDROID_URL);
  });

  it('falls back when no UA header', async () => {
    const res = await worker.fetch(req(null));
    expect(res.headers.get('Location')).toBe(FALLBACK_URL);
  });
});
