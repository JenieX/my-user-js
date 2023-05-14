import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

/** The absolute path of the build folder located at the root */
const buildFolderPath = path.resolve('build');

if (fs.existsSync(buildFolderPath) === true) {
  await fsp.rm(buildFolderPath, { recursive: true });
}
