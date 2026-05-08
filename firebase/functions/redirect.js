export const IOS_URL = 'https://apps.apple.com/gb/app/gogo-game-arranger/id6738794421';
export const ANDROID_URL = 'https://play.google.com/store/apps/details?id=com.gogogamearranger.app';
export const FALLBACK_URL = 'https://gogogamearranger.com/';

export function getRedirectUrl(userAgent) {
  const ua = (userAgent || '').toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return IOS_URL;
  if (/android/.test(ua)) return ANDROID_URL;
  return FALLBACK_URL;
}
