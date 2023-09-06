import path from 'node:path';
import bundleTask from './bundle';
import cleanTask from './clean';
import cssTask from './css';
import getItemInfo from './helpers/get-item-info';
import htmlTask from './html';
import lintTask from './lint';
import listFiles from '../utils/list-files';
import metaBlockTask from './metadata';
import outputTask from './output';
import run from './helpers/tasks-runner';
import sleep from '../utils/sleep';
import watchTask from './watch';
import { BuildTaskOptions, WaitTaskOptions } from './helpers/types';
import { initialConfig } from '../utils/config-handler';
import { userScriptLogger } from './helpers/logger';

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
    console.warn('There is already a build task in progress.');
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
    const userScriptsAbsolutePath = path.resolve('./src');

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

      const relatedUserScripts = initialConfig.sharedModules?.[owner];

      if (relatedUserScripts !== undefined) {
        for (const relatedUserScript of relatedUserScripts) {
          await runBuildTask({ userScripts: [relatedUserScript], autoTriggered: true });
        }
      }
    });
  }
}

export default buildTask;
