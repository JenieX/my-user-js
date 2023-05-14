import 'paint-console';
import fs from 'node:fs';
import path from 'node:path';
import generateReadMe from './helpers/generate-read-me';
import readJSON from '../utils/read-json';
import selectUserScripts from './helpers/select-user-scripts';
import { UserScriptSpecificMetaData } from './helpers/types';
import { checkRequiredDocsItems } from './helpers/check';
import { getPossibleAlias, getPossibleAliasValue, getUserScriptName } from './helpers/alias-handler';
import { initialConfig, setConfig } from '../utils/config-handler';

async function docsTask(): Promise<void> {
  const [selectedUserScripts, allUserScripts] = await selectUserScripts();
  await setConfig({ ...initialConfig, lastRunChoices: selectedUserScripts });

  for (const selectedUserScriptAliasOrName of selectedUserScripts) {
    /** The absolute path of the metadata file of the provided user script */
    const metadataFilePath = path.resolve('src/user-js', selectedUserScriptAliasOrName, 'metadata.json');

    if (fs.existsSync(metadataFilePath) === false) {
      throw new Error('This user script does not have a metadata file');
    }

    const metadata = await readJSON<UserScriptSpecificMetaData>(metadataFilePath);

    checkRequiredDocsItems(metadata);

    let relatedUserScripts: { userScript: string, userScriptAlias: string }[] = [];
    let userScriptName = selectedUserScriptAliasOrName;

    /** Selected user script possible alias */
    const possibleAlias = getPossibleAlias(selectedUserScriptAliasOrName);

    /** Selected user script original value behind the alias */
    const aliasValue = getPossibleAliasValue(possibleAlias);

    if (aliasValue !== undefined) {
      relatedUserScripts = allUserScripts
        .filter((userScript) => {
          const isSelected = userScript === selectedUserScriptAliasOrName;

          return !isSelected && getPossibleAlias(userScript) === possibleAlias;
        }).map((userScript) => {
          return {
            userScript: getUserScriptName(possibleAlias, aliasValue, userScript),
            userScriptAlias: userScript,
          };
        });

      userScriptName = getUserScriptName(possibleAlias, aliasValue, selectedUserScriptAliasOrName);
    }

    await generateReadMe({
      userScript: userScriptName,
      userScriptAlias: selectedUserScriptAliasOrName,
      description: metadata.docs.description,
      usage: metadata.docs.usage,
      limitations: metadata.docs.limitations,
      related: relatedUserScripts,
    });
  }
}

docsTask().catch((exception) => {
  if (exception instanceof Error) {
    console.error(exception.message);
  } else {
    console.error(exception);
  }
});
