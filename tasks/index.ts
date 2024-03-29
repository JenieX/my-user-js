import 'paint-console';
import minimist from 'minimist';
import buildTask from './build';
import selectUserScripts from './helpers/select-user-scripts';
import { BuildTaskOptions } from './helpers/types';
import { initialConfig, setConfig } from '../utils/config-handler';

// BUG when a website is using insecure protocol, will not load the locally served sourcemap file

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
