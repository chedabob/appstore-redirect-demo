// Local dev server for e2e tests. Wraps the redirect logic in an HTTP server
// that emulates what CloudFront Functions does at the edge: reads User-Agent,
// returns a 302 using the same response shape as the CF Function. Dev/test only.
import http from 'node:http';
import { getRedirectUrl } from '../src/redirect.mjs';

const PORT = Number(process.env.PORT) || 8788;

const server = http.createServer(async (req, res) => {
  const ua = req.headers['user-agent'] || '';
  res.writeHead(302, 'Found', {
    Location: getRedirectUrl(ua),
    'Cache-Control': 'no-cache',
  });
  res.end();
});

server.listen(PORT, () => {
  console.log(`cloudfront function local server on http://localhost:${PORT}`);
});
