import fsp from 'node:fs/promises';
import path from 'node:path';
import fs from 'node:fs';
import { MetadataTaskOptions } from './helpers/types';
import type { UserScriptSpecificMetaData } from './helpers/types';
import createMetaData from './helpers/create-metadata';
import createMetadataBlock from './helpers/create-metadata-block';
import { checkNameAgainstAlias, checkRequiredMetadataItems } from './helpers/check';

const developerScriptCodeTemplate = `
GM.xmlHttpRequest({
  url: 'http://localhost:1011/{userScript}',
  method: 'GET',
  onload({ responseText }) {
    // eslint-disable-next-line no-eval
    eval(responseText);
  },
});
`;

async function metadataTask({ userScript, distPath }: MetadataTaskOptions): Promise<string> {
  /** The absolute path of the metadata file of the provided user script */
  const metadataFilePath = path.resolve('src/user-js', userScript, 'metadata.json');

  if (fs.existsSync(metadataFilePath) === false) {
    throw new Error('This user script does not have a metadata file');
  }

  // eslint-disable-next-line unicorn/prefer-json-parse-buffer
  const metadataString = await fsp.readFile(metadataFilePath, 'utf-8');

  /** The metadata of the user script */
  const metadata = JSON.parse(metadataString) as UserScriptSpecificMetaData;

  checkNameAgainstAlias(metadata.name, userScript);
  checkRequiredMetadataItems(metadata);

  const mergedMetadata = createMetaData(metadata, userScript);
  mergedMetadata.name = `jx-${mergedMetadata.name}`;

  /** Later, making the metadata into string  */

  const metadataBlock = createMetadataBlock(mergedMetadata);
  const metadataFileName = `${userScript}.meta.js`;
  await fsp.writeFile(path.join(distPath, metadataFileName), metadataBlock);

  // Mutating the original because we are done with it
  mergedMetadata.name += ' [DEV]';
  mergedMetadata.version = '0.0.0';
  const grant = mergedMetadata.grant as string[] | undefined;
  if (grant === undefined) {
    mergedMetadata.grant = ['GM.xmlHttpRequest'];
  } else if (!grant.includes('GM.xmlHttpRequest')) {
    grant.push('GM.xmlHttpRequest');
  }

  const developerMetadataBlock = createMetadataBlock(mergedMetadata);
  const developerScriptCode = developerScriptCodeTemplate.replace('{userScript}', userScript);
  const developerScript = developerMetadataBlock + developerScriptCode;

  const developerScriptFileName = `${userScript}.dev.js`;
  await fsp.writeFile(path.join(distPath, developerScriptFileName), developerScript);

  return metadataBlock;
}

export default metadataTask;
