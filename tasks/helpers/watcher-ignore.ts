import path from 'node:path';
import getItemInfo from './get-item-info';

const userScriptsAbsolutePath = path.resolve('./src/user-js');

function watcherIgnore(itemAbsolutePath: string): boolean {
  const itemPath = itemAbsolutePath.replace(userScriptsAbsolutePath, '');
  const itemPathSegments = itemPath.split('\\');

  // ------------------------
  /** Just to make the process easier after */
  if (itemAbsolutePath === userScriptsAbsolutePath) {
    return false;
  }

  // ------------------------
  // Example: \userscript-name
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
  const itemInfo = getItemInfo(itemPath);

  /** The case of files that are targets */
  if (itemInfo.type !== undefined) {
    return false;
  }

  // ------------------------
  /** The case of files (or folders containing a "."), which will be ignored */
  if (itemInfo.isFile) {
    return true;
  }

  // ------------------------
  /** The case of folders or files with no "."  */
  return false;
}

export default watcherIgnore;
