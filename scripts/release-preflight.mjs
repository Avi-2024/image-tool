import nextEnv from '@next/env';
import {access} from 'node:fs/promises';
import {resolveSiteSettings} from '../config/site-settings.mjs';
nextEnv.loadEnvConfig(process.cwd());
try {
  const site = resolveSiteSettings({url: process.env.NEXT_PUBLIC_SITE_URL, indexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING, contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL});
  if (!site.indexable) throw new Error('Set the real NEXT_PUBLIC_SITE_URL and NEXT_PUBLIC_ALLOW_INDEXING=true for a public release.');
  if (!site.contactEmail) throw new Error('Set NEXT_PUBLIC_CONTACT_EMAIL before public launch.');
  for (const directory of ['public/__qa', 'out/__qa']) {
    if (await access(directory).then(() => true, () => false)) throw new Error(`Remove ${directory}; test pages and fixtures must never ship.`);
  }
  console.log(`Release configuration accepted for ${site.url}. This does not deploy the site.`);
} catch (error) { console.error(`Release blocked: ${error.message}`); process.exitCode = 1; }
