import { onRequest } from 'firebase-functions/v2/https';
import { getRedirectUrl } from './redirect.js';

export const redirect = onRequest((req, res) => {
  res.redirect(302, getRedirectUrl(req.headers['user-agent']));
});
