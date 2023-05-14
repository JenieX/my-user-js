import fsp from 'node:fs/promises';
import htmlnano from 'htmlnano';
import path from 'node:path';
import posthtml from 'posthtml';
import listFiles from '../utils/list-files';
import { HTMLTaskOptions } from './helpers/types';

async function htmlTask({ userScript, distPath }: HTMLTaskOptions): Promise<string[]> {
  /** The absolute path of the document folder of the provided user script */
  const documentFolderPath = path.resolve('src/user-js', userScript, 'html');

  /** A list of absolute paths to the document files located at the user script document folder */
  const documentFilesPaths = await listFiles({
    folderPath: documentFolderPath,
    getFullPath: true,
    filter: ['.html'],
  });

  if (documentFilesPaths.length === 0) {
    return [];
  }

  const htmlFiles = [];

  for (const documentFilePath of documentFilesPaths) {
    const documentName = path.basename(documentFilePath, '.html');

    const content = await fsp.readFile(documentFilePath, 'utf-8');

    const plugins = [
      htmlnano({
        removeEmptyAttributes: false,
        collapseWhitespace: 'conservative',
      }),
    ];

    const { html: htmlMini } = await posthtml(plugins).process(content);
    const htmlFileName = `${documentName}.html`;
    await fsp.writeFile(path.join(distPath, htmlFileName), htmlMini);
    htmlFiles.push(htmlFileName);
  }

  return htmlFiles;
}

export default htmlTask;
