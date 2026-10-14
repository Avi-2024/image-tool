/** Shared by the app and release preflight; never infer the production domain. */
export function resolveSiteSettings({url, indexing, contactEmail, googleVerification} = {}) {
  const parsed = new URL(url?.trim() || 'http://localhost:3000');
  if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password || parsed.pathname !== '/' || parsed.search || parsed.hash) {
    throw new Error('NEXT_PUBLIC_SITE_URL must be an HTTP(S) origin without a path, credentials, query or fragment.');
  }
  const host = parsed.hostname.toLowerCase();
  const publicOrigin = parsed.protocol === 'https:' && !parsed.port && host.includes('.') &&
    !/^(localhost|.*\.localhost|.*\.local|.*\.test|.*\.invalid|.*\.example|example\.(com|org|net)|.*\.example\.(com|org|net))$/.test(host) &&
    !/^\d+\.\d+\.\d+\.\d+$/.test(host) && !host.includes(':');
  if (indexing && !['true', 'false'].includes(indexing)) throw new Error('NEXT_PUBLIC_ALLOW_INDEXING must be true or false.');
  if (indexing === 'true' && !publicOrigin) throw new Error('Indexing requires a real public HTTPS origin.');
  const email = contactEmail?.trim() || '';
  if (email && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) throw new Error('NEXT_PUBLIC_CONTACT_EMAIL must be a valid email address.');
  return {url: parsed.origin, indexable: indexing === 'true' && publicOrigin, contactEmail: email, googleVerification: googleVerification?.trim() || ''};
}
