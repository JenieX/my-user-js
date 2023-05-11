import path from 'node:path';
import { BuildTaskOptions, WaitTaskOptions } from './helpers/types';
import run from './helpers/tasks-runner';
import sleep from '../utils/sleep';
import { userScriptLogger } from './helpers/logger';
import watchTask from './watch';
import getItemInfo from './helpers/get-item-info';
import { getConfig } from '../utils/config-handler';
import cssTask from './css';
import cleanTask from './clean';
import listFiles from '../utils/list-files';
import htmlTask from './html';
import metaBlockTask from './metadata';
import bundleTask from './bundle';
import outputTask from './output';
import lintTask from './lint';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function waitTask({ delay }: WaitTaskOptions): Promise<void> {
  await sleep(delay);
}

/** A boolean indicating whether there is a build task in progress or not */
let building = false;

async function runBuildTask(buildOptions: BuildTaskOptions): Promise<void> {
  if (building === false) {
    building = true;
    await buildTask(buildOptions);
    building = false;
  } else {
    console.warn('There is already a build task in progress');
  }
}

async function buildTask(options: BuildTaskOptions): Promise<void> {
  const { userScripts, watch, lint, css, html, autoTriggered } = options;

  for (const userScript of userScripts) {
    userScriptLogger(userScript, autoTriggered);

    /** The distribution folder of the user script */
    const distPath = path.resolve(`dist/${userScript}`);

    await run(cleanTask, { distPath, css, html });
    // await run(waitTask, { delay: 1000 });

    /** Ready style files names located at the distribution folder */
    const cssFiles = await (css === true ?
      run<string[]>(cssTask, { userScript, distPath }) :
      listFiles({ folderPath: distPath, filter: ['.css'] })
    );

    /** Ready document files names located at the distribution folder */
    const htmlFiles = await (html === true ?
      run<string[]>(htmlTask, { userScript, distPath }) :
      listFiles({ folderPath: distPath, filter: ['.html'] })
    );

    const metadataBlock = await run<string>(metaBlockTask, { userScript, distPath });

    const [devBundle, devBundleSourceMap] = await run<[string, string]>(bundleTask, {
      userScript,
      distPath,
      files: [...cssFiles, ...htmlFiles],
    });

    let userBundle: string | undefined;
    if (lint === true) {
      // devBundle = devBundle.replaceAll(/^\/\* (.+) \*\/$/gm, (match, g1) => {
      //   if (g1.includes('@typescript-eslint')) {
      //     return '';
      //   }

      //   return match;
      // });
      userBundle = await run<string>(lintTask, { devBundle, metadataBlock });
    }

    await run(outputTask, {
      userScript,
      distPath,
      devBundle,
      devBundleSourceMap,
      userBundle,
    });
  }

  if (watch !== undefined) {
    const userScriptsAbsolutePath = path.resolve('./src/user-js');
    const config = await getConfig() as { sharedModules?: { [key: string]: string[] } };

    const watcher = watchTask({ userScripts });

    watcher.on('change', async (fileAbsolutePath: string) => {
      const filePath = fileAbsolutePath.replace(userScriptsAbsolutePath, '');

      const { type, owner } = getItemInfo(filePath);
      if (type === undefined) {
        return;
      }

      await runBuildTask({
        userScripts: [owner],
        css: type === 'style' ? true : undefined,
        html: type === 'document' ? true : undefined,
      });

      /** Next section is for trigging related user scripts */

      const properFilePath = filePath.replaceAll('\\', '/');
      const relatedUserScripts = config.sharedModules?.[properFilePath];

      if (relatedUserScripts !== undefined) {
        for (const relatedUserScript of relatedUserScripts) {
          await runBuildTask({ userScripts: [relatedUserScript], autoTriggered: true });
        }
      }
    });
  }
}

export default buildTask;
