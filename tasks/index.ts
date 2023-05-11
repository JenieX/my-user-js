import 'paint-console';
import minimist from 'minimist';
import path from 'node:path';
import { checkbox } from '../utils/prompt';
import { getConfig, setConfig } from '../utils/config-handler';
import createChoices from './helpers/create-choices';
import buildTask from './build';
import { BuildTaskOptions } from './helpers/types';
import listFolders from '../utils/list-folders';

// BUG when a website is using insecure protocol, will not load the locally served sourcemap file

const userScriptsAbsolutePath = path.resolve('./src/user-js');
const userScript = await listFolders({ folderPath: userScriptsAbsolutePath });

const { watch } = minimist(process.argv.slice(2)) as { watch?: true };

const config = await getConfig();

const choices = createChoices(userScript, config.lastRunChoices as string[] | undefined);
const selectedUserScripts = await checkbox('Select some user scripts', choices) as string[];

config.lastRunChoices = selectedUserScripts;
await setConfig(config);

const initialOptions: BuildTaskOptions = {
  userScripts: selectedUserScripts,
  watch,
  lint: watch === undefined ? true : undefined,
  css: true,
  html: true,
};

buildTask(initialOptions).catch((exception) => {
  if (exception instanceof Error) {
    console.error(exception.message);
  } else {
    console.error(exception);
  }
});
