import path from 'node:path';
import fs from 'node:fs';
import fsp from 'node:fs/promises';

/** The absolute path of the build folder located at the root */
const buildFolderPath = path.resolve('build');

if (fs.existsSync(buildFolderPath) === true) {
  await fsp.rm(buildFolderPath, { recursive: true });
}
