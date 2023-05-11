import fsp from 'node:fs/promises';
import listFiles from './list-files';
import { DeleteFilesOptions } from './types';

async function deleteFiles({ folderPath, filter }: DeleteFilesOptions): Promise<void> {
  const filesAbsolutePaths = await listFiles({ folderPath, getFullPath: true, filter });

  for (const filePath of filesAbsolutePaths) {
    await fsp.unlink(filePath);
  }
}

export default deleteFiles;
