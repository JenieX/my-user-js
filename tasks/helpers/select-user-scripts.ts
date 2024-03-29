import path from 'node:path';
import createChoices from './create-choices';
import listFolders from '../../utils/list-folders';
import { checkbox } from '../../utils/prompt';
import { initialConfig } from '../../utils/config-handler';

async function selectUserScripts(): Promise<[string[], string[]]> {
  const userScriptsAbsolutePath = path.resolve('./src');
  const userScripts = await listFolders({ folderPath: userScriptsAbsolutePath });
  const choices = createChoices(userScripts, initialConfig.lastRunChoices);
  const selectedUserScripts = await checkbox('Select some user scripts', choices) as string[];

  return [selectedUserScripts, userScripts];
}

export default selectUserScripts;
