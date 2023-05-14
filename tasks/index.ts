import 'paint-console';
import minimist from 'minimist';
import { initialConfig, setConfig } from '../utils/config-handler';
import buildTask from './build';
import { BuildTaskOptions } from './helpers/types';
import selectUserScripts from './helpers/select-user-scripts';

// BUG when a website is using insecure protocol, will not load the locally served sourcemap file
// TODO Add minimist back to the deps

const [selectedUserScripts] = await selectUserScripts();
const { watch } = minimist(process.argv.slice(2)) as { watch?: true };

await setConfig({ ...initialConfig, lastRunChoices: selectedUserScripts });

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
