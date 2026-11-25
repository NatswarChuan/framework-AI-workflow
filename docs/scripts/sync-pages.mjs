import fs from 'node:fs';
import path from 'node:path';

const mode = process.argv[2];
const docsDir = path.resolve(import.meta.dirname, '..');

if (mode === 'prepare') {
  fs.rmSync(path.join(docsDir, 'dist'), { recursive: true, force: true });
  fs.rmSync(path.join(docsDir, 'assets'), { recursive: true, force: true });
  fs.copyFileSync(path.join(docsDir, 'index.source.html'), path.join(docsDir, 'index.html'));
} else if (mode === 'publish') {
  fs.copyFileSync(path.join(docsDir, 'dist', 'index.html'), path.join(docsDir, 'index.html'));
  fs.cpSync(path.join(docsDir, 'dist', 'assets'), path.join(docsDir, 'assets'), { recursive: true });
} else {
  throw new Error(`Unknown sync-pages mode: ${mode}`);
}
