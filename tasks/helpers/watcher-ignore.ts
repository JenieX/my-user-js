import path from 'node:path';
import getItemInfo from './get-item-info';

const sourceAbsolutePath = path.resolve('./src');

function watcherIgnore(scriptAbsolutePath: string): boolean {
  const scriptRelativePath = scriptAbsolutePath.replace(sourceAbsolutePath, '');
  const itemPathSegments = scriptRelativePath.split('\\');

  /** Just to make the process easier after. */
  if (scriptAbsolutePath === sourceAbsolutePath) {
    return false;
  }

  /** Example: "\userscript-name". */
  if (itemPathSegments.length === 2) {
    return false;
  }

  // ------------------------

  const stripedItemPath = itemPathSegments.slice(2).join('\\');

  const allowedAtRoot = [
    'css',
    'html',
    'js',
    'index.ts',
    'metadata.json',
  ];

  if (itemPathSegments.length === 3) {
    if (allowedAtRoot.includes(stripedItemPath)) {
      return false;
    }

    return true;
  }

  // ------------------------

  const itemInfo = getItemInfo(scriptRelativePath);

  /** The case of files that are targets */
  if (itemInfo.type !== undefined) {
    return false;
  }

  /** The case of files (or folders containing a "."), which will be ignored */
  if (itemInfo.isFile) {
    return true;
  }

  /** The case of folders or files with no "."  */
  return false;
}

export default watcherIgnore;
