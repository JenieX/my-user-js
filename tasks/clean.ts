import fs from 'node:fs';
import deleteFiles from '../utils/delete-files.js';
import { CleanTaskOptions } from './helpers/types';

async function cleanTask({ distPath, css, html }: CleanTaskOptions): Promise<void> {
  if (fs.existsSync(distPath) === false) {
    fs.mkdirSync(distPath, { recursive: true });

    return;
  }

  if (css === true) {
    await deleteFiles({ folderPath: distPath, filter: ['.css'] });
  }

  if (html === true) {
    await deleteFiles({ folderPath: distPath, filter: ['.html'] });
  }

  await deleteFiles({ folderPath: distPath, filter: ['.js', '.map'] });
}

export default cleanTask;
