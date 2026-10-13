// Temporary test-only harness. Remove public/__qa before release/build.
import fs from 'node:fs';
fs.mkdirSync('public/__qa/fixtures',{recursive:true});
for(const file of fs.readdirSync('tests/fixtures'))fs.copyFileSync(`tests/fixtures/${file}`,`public/__qa/fixtures/${file}`);
fs.copyFileSync('tests/browser-harness.html','public/__qa/index.html');
