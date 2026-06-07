// Create or update the CloudFront Function, then publish it.
//
// CloudFront Functions are global (no --region needed). After publish, associate
// the printed ARN with a viewer-request trigger on your distribution. See ARCHITECTURE.md.
//
// Optional env:
//   FUNCTION_NAME   defaults to "appstore-redirect"
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const FUNCTION_NAME = process.env.FUNCTION_NAME || 'appstore-redirect';
const FUNCTION_CODE = readFileSync('src/function.js');
const CONFIG = JSON.stringify({ Comment: '', Runtime: 'cloudfront-js-2.0' });

function cf(args) {
  return JSON.parse(
    execFileSync('aws', ['cloudfront', ...args, '--output', 'json'], { encoding: 'utf8' }),
  );
}

function getExistingETag() {
  try {
    const res = cf(['describe-function', '--name', FUNCTION_NAME, '--stage', 'DEVELOPMENT']);
    return res.ETag;
  } catch {
    return null;
  }
}

let etag = getExistingETag();

if (etag) {
  console.log(`Updating ${FUNCTION_NAME}…`);
  const res = cf([
    'update-function',
    '--name', FUNCTION_NAME,
    '--if-match', etag,
    '--function-config', CONFIG,
    '--function-code', `fileb://src/function.js`,
  ]);
  etag = res.ETag;
} else {
  console.log(`Creating ${FUNCTION_NAME}…`);
  const res = cf([
    'create-function',
    '--name', FUNCTION_NAME,
    '--function-config', CONFIG,
    '--function-code', `fileb://src/function.js`,
  ]);
  etag = res.ETag;
}

console.log('Publishing…');
const published = cf(['publish-function', '--name', FUNCTION_NAME, '--if-match', etag]);

console.log('\n✓ Published. Associate this ARN with a viewer-request trigger');
console.log('  on your CloudFront distribution behaviour:\n');
console.log(`    ${published.FunctionSummary.FunctionArn}\n`);
console.log('  Then deploy/invalidate the distribution. See ARCHITECTURE.md.');
