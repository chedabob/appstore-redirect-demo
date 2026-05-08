import { describe, it, expect } from 'vitest';
import { getRedirectUrl, IOS_URL, ANDROID_URL, FALLBACK_URL } from '../../functions/redirect.js';

describe('getRedirectUrl', () => {
  it.each([
    ['iPhone',   'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',        IOS_URL],
    ['iPad',     'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)',                  IOS_URL],
    ['iPod',     'Mozilla/5.0 (iPod touch; CPU iPhone OS 16_0 like Mac OS X)',     IOS_URL],
    ['Android',  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36',   ANDROID_URL],
    ['Samsung',  'Mozilla/5.0 (Linux; Android 13; SM-G991B) SamsungBrowser/23.0', ANDROID_URL],
    ['Desktop',  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/124',    FALLBACK_URL],
    ['Googlebot','Googlebot/2.1 (+http://www.google.com/bot.html)',                FALLBACK_URL],
    ['empty UA', '',                                                                FALLBACK_URL],
    ['null UA',  null,                                                              FALLBACK_URL],
  ])('%s → correct URL', (_label, ua, expected) => {
    expect(getRedirectUrl(ua)).toBe(expected);
  });
});
