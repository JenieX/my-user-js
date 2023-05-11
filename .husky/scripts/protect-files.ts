import { execSync } from 'node:child_process';
import 'paint-console';

const filesToCommit = execSync('git diff --cached --name-only').toString()
  .split('\n')
  .filter(Boolean);

const deletedFiles: string[] = execSync('git diff --cached --name-only --diff-filter=D')
  .toString()
  .split('\n')
  .filter(Boolean);

let restored = 0;

for (const deletedFile of deletedFiles) {
  if (deletedFile.endsWith('.user.js') || deletedFile.endsWith('.meta.js')) {
    restored += 1;
    execSync(`git restore --staged ${deletedFile}`);
    console.info(`Restored: ${deletedFile}`);
  }
}

if (filesToCommit.length === restored) {
  console.warn('No files left to commit');
  process.exit(1);
}
