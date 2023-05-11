import path from 'node:path';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import { ListFoldersOptions } from './types';

/**
 * Get a list of folders that are present in the provided folder path
 */
async function listFolders({ folderPath, getFullPath }: ListFoldersOptions): Promise<string[]> {
  if (fs.existsSync(folderPath) === false) {
    throw new Error('The provided folder path does not exists');
  }

  const items = await fsp.readdir(folderPath, {
    withFileTypes: true,
  });

  const folders = items
    .filter((item) => item.isDirectory() === true)
    .map((folderItem) => {
      if (getFullPath === undefined) {
        return folderItem.name;
      }

      return path.join(folderPath, folderItem.name);
    });

  return folders;
}

export default listFolders;
