// CloudFront Function — viewer-request event.
//
// Self-contained (no imports): the CF Functions runtime has no module system.
// Associate the function ARN with the viewer-request trigger on the CloudFront
// behaviour you want to redirect. See ARCHITECTURE.md for console/IaC steps.
//
// Runtime: cloudfront-js-2.0
var IOS_URL = 'https://apps.apple.com/gb/app/gogo-game-arranger/id6738794421';
var ANDROID_URL = 'https://play.google.com/store/apps/details?id=com.gogogamearranger.app';
var FALLBACK_URL = 'https://gogogamearranger.com/';

function getRedirectUrl(userAgent) {
  var ua = (userAgent || '').toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return IOS_URL;
  if (/android/.test(ua)) return ANDROID_URL;
  return FALLBACK_URL;
}

function handler(event) {
  var request = event.request;

  if (request.uri === '/store') {
    var uaHeader = request.headers['user-agent'];
    var ua = uaHeader ? uaHeader.value : '';
    return {
      statusCode: 302,
      statusDescription: 'Found',
      headers: {
        location: { value: getRedirectUrl(ua) },
        // Prevent CloudFront from serving one device's redirect to another.
        'cache-control': { value: 'no-cache' },
      },
    };
  }

  return request;
}
