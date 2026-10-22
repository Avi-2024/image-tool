import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

const expectedPaths = ['/', '/png-to-jpg/', '/jpg-to-png/', '/webp-to-jpg/', '/webp-to-png/', '/png-to-webp/', '/jpg-to-webp/', '/about/', '/contact/', '/privacy/'];
const input = process.argv[2];
if (!input) {
  console.error('Usage: npm run check:live -- https://your-production-host');
  process.exit(1);
}
const url = new URL(input);
assert.equal(url.protocol, 'https:', 'Live checks require HTTPS');
assert.equal(url.pathname, '/', 'Pass the root origin, not a subpath');
assert.ok(!url.search && !url.hash && !url.username && !url.password);
const origin = url.origin;
async function load(path) {
  const response = await fetch(new URL(path, origin), { redirect: 'follow', signal: AbortSignal.timeout(20000) });
  return { response, body: await response.text() };
}
const map = await load('/sitemap.xml');
assert.equal(map.response.status, 200, 'Sitemap must return 200');
const xml = new JSDOM(map.body, {contentType: 'text/xml'}).window.document;
const found = [...xml.querySelectorAll('loc')].map(loc => new URL(loc.textContent).href).sort();
const expected = expectedPaths.map(path => new URL(path, origin).href).sort();
assert.deepEqual(found, expected, 'Sitemap URLs must match the production origin and ten routes');

const robots = await load('/robots.txt');
assert.equal(robots.response.status, 200);
assert.ok(robots.body.includes(`Sitemap: ${origin}/sitemap.xml`), 'Missing production sitemap declaration');

for (const path of expectedPaths) {
  const {response, body} = await load(path);
  assert.equal(response.status, 200, `${path}: unexpected HTTP status`);
  assert.ok(!/\bnoindex\b/i.test(response.headers.get('x-robots-tag') || ''), `${path}: X-Robots-Tag blocks indexing`);
  for (const header of ['x-content-type-options', 'referrer-policy', 'permissions-policy']) {
    assert.ok(response.headers.has(header), `${path}: missing ${header}`);
  }
  const doc = new JSDOM(body).window.document;
  const expectedCanonical = new URL(path, origin).href;
  assert.equal(doc.querySelector('link[rel="canonical"]')?.href, expectedCanonical, `${path}: canonical mismatch`);
  const robotsTag = doc.querySelector('meta[name="robots"]')?.content || '';
  assert.ok(/\bindex\b/i.test(robotsTag) && !/\bnoindex\b/i.test(robotsTag), `${path}: not indexable`);
  assert.equal(doc.querySelector('meta[property="og:url"]')?.content, expectedCanonical, `${path}: Open Graph origin mismatch`);
  for (const property of ['og:image', 'twitter:image']) {
    const value = doc.querySelector(`meta[property="${property}"], meta[name="${property}"]`)?.content;
    assert.ok(value && new URL(value, origin).origin === origin, `${path}: invalid ${property}`);
  }
  for (const script of doc.querySelectorAll('script[type="application/ld+json"]')) {
    assert.ok(!script.textContent.includes('localhost'), `${path}: localhost in structured data`);
  }
  assert.ok(!body.includes('http://localhost:3000'), `${path}: localhost leaked into output`);
}
for (const asset of ['/og-image.png', '/fonts/geist-latin.woff2']) {
  const {response} = await load(asset);
  assert.equal(response.status, 200, `Missing public asset: ${asset}`);
}
const home = new JSDOM((await load('/')).body).window.document;
const js = [...home.querySelectorAll('script[src]')].map(s => s.getAttribute('src')).find(src => src.startsWith('/_next/static/'));
assert.ok(js, 'Could not find a fingerprinted JavaScript asset');
assert.equal((await load(js)).response.status, 200, 'JavaScript asset not reachable');
const missing = await load('/__release-check-this-page-does-not-exist-927/');
assert.equal(missing.response.status, 404, 'Unknown paths must return genuine 404s');
console.log(`Live release checks passed for ${origin}: 10 indexable pages, canonical metadata, sitemap, headers, assets and 404.`);
