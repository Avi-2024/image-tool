import { spawnSync } from 'node:child_process';

const environment = process.env.VERCEL_ENV;
if (!['production', 'preview', 'development'].includes(environment)) {
  console.error('Vercel release blocked: VERCEL_ENV must be production, preview, or development.');
  process.exit(1);
}

// Vercel builds static HTML. A preview must never inherit production indexing
// or analytics settings from broadly scoped Vercel environment variables.
const env = { ...process.env };
if (environment !== 'production') {
  env.NEXT_PUBLIC_ALLOW_INDEXING = 'false';
  env.NEXT_PUBLIC_GA_MEASUREMENT_ID = '';
}
const tasks = environment === 'production'
  ? ['build:release']
  : ['build', 'check:seo'];

for (const task of tasks) {
  console.log(`Vercel ${environment}: npm run ${task}`);
  const child = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', task], {
    stdio: 'inherit',
    env,
  });
  if (child.error) {
    console.error(child.error);
    process.exit(1);
  }
  if (child.status !== 0) process.exit(child.status || 1);
}
