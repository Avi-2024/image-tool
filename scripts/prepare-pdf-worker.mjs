import {copyFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';

const require=createRequire(import.meta.url);
const packageRoot=resolve(require.resolve('pdfjs-dist/package.json'),'..');
await copyFile(resolve(packageRoot,'build/pdf.worker.min.mjs'),resolve('public/pdf.worker.min.mjs'));
