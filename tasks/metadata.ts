import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import createMetadataBlock from './helpers/create-metadata-block';
import createMetaData from './helpers/create-metadata';
import { UserScriptSpecificMetaData, MetadataTaskOptions } from './helpers/types';
import { checkNameAgainstAlias, checkRequiredMetadataItems } from './helpers/check';

const developerScriptCodeTemplate = `
let url = 'http://localhost:1011/{userScript}';

if (navigator.userAgent.includes('Firefox')) {
  const exposerUUID = sessionStorage.getItem('exposerUUID').slice(0, -1);

  // eslint-disable-next-line prefer-template
  url = exposerUUID + '/{userScript}/{userScript}.raw.js';
}

fetch(url)
  .then(async (response) => response.text())
  .then(async (responseText) => {
    // eslint-disable-next-line no-eval
    eval(responseText);
  }).catch((exception) => console.error(exception));
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

  const developerMetadataBlock = createMetadataBlock(mergedMetadata);
  const developerScriptCode = developerScriptCodeTemplate.replace('{userScript}', userScript);
  const developerScript = developerMetadataBlock + developerScriptCode;

  const developerScriptFileName = `${userScript}.dev.js`;
  await fsp.writeFile(path.join(distPath, developerScriptFileName), developerScript);

  return metadataBlock;
}

export default metadataTask;
