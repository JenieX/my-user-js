import Watcher from 'watcher';
import path from 'node:path';
import watcherIgnore from './helpers/watcher-ignore';
import { watcherLogger } from './helpers/logger';

function watchTask({ userScripts }: { userScripts: string[] }): Watcher {
  const userScriptsPaths = userScripts.map((userScript) => {
    return path.resolve('src/user-js', userScript);
  });

  watcherLogger(userScripts);

  const watcher = new Watcher(userScriptsPaths, {
    ignoreInitial: true,
    recursive: true,
    ignore: watcherIgnore,
  });

  return watcher;
}

export default watchTask;
