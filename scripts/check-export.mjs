import {readFile, access} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';

const release = process.argv.includes('--release');
const root = path.resolve('out');
const read = file => readFile(path.join(root, file), 'utf8');
const exists = file => access(file).then(() => true, () => false);
const sitemap = new JSDOM(await read('sitemap.xml'), {contentType: 'text/xml'}).window.document;
const urls = [...sitemap.querySelectorAll('loc')].map(node => new URL(node.textContent));
const paths = ['/', '/png-to-jpg/', '/jpg-to-png/', '/webp-to-jpg/', '/webp-to-png/', '/png-to-webp/', '/jpg-to-webp/', '/about/', '/contact/', '/privacy/'];
assert.deepEqual(urls.map(url => url.pathname).sort(), [...paths].sort(), 'Sitemap must contain exactly the ten public canonical pages');
const origin = urls[0].origin;
if (release) {
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  assert.ok(configuredOrigin, 'Production sitemap requires NEXT_PUBLIC_SITE_URL');
  assert.equal(origin, new URL(configuredOrigin).origin, 'Production sitemap must match the configured canonical site origin');
  assert.equal(new URL(origin).protocol, 'https:', 'Public sitemaps must use HTTPS');
  assert.ok(!urls.some(url => url.hostname === 'localhost'), 'Production sitemap contains localhost URLs');
}
const titles = new Set(), descriptions = new Set();
let internalLinks = 0;
for (const url of urls) {
  assert.equal(url.origin, origin);
  const document = new JSDOM(await read(`${url.pathname.slice(1)}index.html`)).window.document;
  const title = document.title, description = document.querySelector('meta[name="description"]')?.content;
  assert.ok(title && description, `Missing metadata: ${url.pathname}`);
  assert.ok(!titles.has(title) && !descriptions.has(description), `Duplicate metadata: ${url.pathname}`);
  titles.add(title); descriptions.add(description);
  assert.equal(document.querySelectorAll('h1').length, 1);
  assert.equal(document.querySelector('link[rel="canonical"]')?.href, url.href);
  for (const property of ['title', 'description', 'url', 'image']) assert.ok(document.querySelector(`meta[property="og:${property}"]`)?.content, `Missing og:${property}`);
  assert.equal(document.querySelector('meta[property="og:title"]').content, title);
  assert.equal(document.querySelector('meta[property="og:description"]').content, description);
  assert.equal(document.querySelector('meta[property="og:url"]').content, url.href);
  assert.equal(document.querySelector('meta[name="twitter:card"]')?.content, 'summary_large_image');
  const robots = document.querySelector('meta[name="robots"]')?.content;
  assert.ok(robots, 'Robots directive is missing');
  if (release) assert.ok(!robots.includes('noindex') && /\bindex\b/.test(robots), `Not indexable: ${url.pathname}`);
  if (!release) assert.ok(robots.includes('noindex'), `Preview accidentally indexable: ${url.pathname}`);
  if (release) {
    for (const selector of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
      const imageUrl = document.querySelector(selector)?.content;
      assert.ok(imageUrl, `Missing social image: ${url.pathname}`);
      assert.equal(new URL(imageUrl, url).origin, origin, `Wrong social image origin: ${url.pathname}`);
    }
  }
  for (const script of document.querySelectorAll('script[type="application/ld+json"]')) {
    const data = JSON.parse(script.textContent);
    assert.equal(data['@context'], 'https://schema.org');
    if (release) assert.ok(!JSON.stringify(data).includes('localhost'), `Localhost structured data: ${url.pathname}`);
    if (data['@type'] === 'FAQPage') for (const question of data.mainEntity) {
      assert.ok(document.body.textContent.includes(question.name));
      assert.ok(document.body.textContent.includes(question.acceptedAnswer.text));
    }
  }
  for (const anchor of document.querySelectorAll('a[href]')) {
    const target = new URL(anchor.getAttribute('href'), url);
    if (target.origin !== origin) continue;
    const filename = target.pathname.endsWith('/') ? `${target.pathname.slice(1)}index.html` : target.pathname.slice(1);
    assert.ok(await exists(path.join(root, filename)), `Broken link: ${target.href}`);
    if (target.hash) {
      const targetDoc = target.pathname === url.pathname ? document : new JSDOM(await read(filename)).window.document;
      assert.ok(targetDoc.getElementById(decodeURIComponent(target.hash.slice(1))), `Missing anchor: ${target.href}`);
    }
    internalLinks++;
  }
}
const robots = await read('robots.txt');
assert.ok(robots.includes('Allow: /'));
if (release) assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
const notFound = new JSDOM(await read('404.html')).window.document;
assert.ok([...notFound.querySelectorAll('meta[name="robots"]')].some(meta => meta.content.includes('noindex')), '404 must not be indexed');
assert.ok(await exists(path.join(root, 'og-image.png')));
assert.ok(!await exists(path.join(root, '__qa')), 'Test harness must not ship');
console.log(`SEO export passed: ${urls.length} unique canonical pages, ${internalLinks} internal links, social metadata, visible FAQ schemas, robots, 404 and no QA assets. Mode: ${release ? 'release' : 'preview'}.`);
