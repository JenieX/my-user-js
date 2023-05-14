import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { ListFilesOptions } from './types';

/**
 * Get a list of files that are present in the provided folder path.
 * If the provided folder path does not exists, it will return an empty array.
 */
async function listFiles(listFilesOptions: ListFilesOptions): Promise<string[]> {
  const { folderPath, getFullPath, filter } = listFilesOptions;

  if (fs.existsSync(folderPath) === false) {
    return [];
  }

  const items = await fsp.readdir(folderPath, {
    withFileTypes: true,
  });

  const files = items
    .filter((item) => item.isDirectory() === false)
    .map((fileItem) => {
      if (getFullPath === undefined) {
        return fileItem.name;
      }

      return path.join(folderPath, fileItem.name);
    });

  if (filter === undefined) {
    return files;
  }

  return files.filter((fileName) => {
    const fileExtension = path.extname(fileName);

    return filter.includes(fileExtension) === true;
  });
}

export default listFiles;
