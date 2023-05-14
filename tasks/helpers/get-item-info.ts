import { ItemInfo } from './types';

/**
 * Get the info for the path that is emitted by the Watcher class
 */
function getItemInfo(itemPath: string): ItemInfo {
  const itemPathSegments = itemPath.split('\\');

  let type: ItemInfo['type'];

  if (
    /** Ensure the correct folder */
    itemPathSegments[2] === 'css' &&
    /** Ensure no nesting */
    itemPathSegments.length === 4 &&
    itemPath.endsWith('.scss')
  ) {
    type = 'style';
  }

  if (
    itemPathSegments[2] === 'html' &&
    itemPathSegments.length === 4 &&
    itemPath.endsWith('.html')
  ) {
    type = 'document';
  }

  if (
    itemPath.endsWith('.ts') &&
    itemPathSegments[2] === 'js'
  ) {
    type = 'script';
  }

  if (
    itemPathSegments.length === 3 &&
    itemPath.endsWith('index.ts')
  ) {
    type = 'index';
  }

  if (
    itemPathSegments.length === 3 &&
    itemPath.endsWith('metadata.json')
  ) {
    type = 'metadata';
  }

  return {
    type,
    isFile: itemPathSegments.at(-1)!.includes('.'),
    owner: itemPathSegments[1] as string,
  };
}

export default getItemInfo;
