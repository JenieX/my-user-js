import { JSONLike, Strings } from '../../utils/types';

function createLine(key: string, value: string): string {
  const whiteSpace = ' '.repeat(15 - key.length);
  const joined = (key + whiteSpace + value).trim();

  return `// @${joined}\n`;
}

function createMetadataBlock(mergedMetadata: JSONLike<Strings>): string {
  let metadataBlock = '';
  metadataBlock += '// ==UserScript==\n';

  for (const [key, value] of Object.entries(mergedMetadata)) {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        for (const arrayValue of value) {
          metadataBlock += createLine(key, arrayValue);
        }
      } else {
        metadataBlock += createLine(key, value);
      }
    }
  }

  metadataBlock += '// ==/UserScript==\n';

  return metadataBlock;
}

export default createMetadataBlock;
