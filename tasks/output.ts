import fsp from 'node:fs/promises';
import path from 'node:path';
import { OutputTaskOptions } from './helpers/types';

async function outputTask(options: OutputTaskOptions): Promise<void> {
  const { userScript, distPath, devBundle, devBundleSourceMap, userBundle } = options;

  const devScriptPath = path.join(distPath, `${userScript}.raw.js`);
  await fsp.writeFile(devScriptPath, devBundle);

  const devScriptSourcemapPath = path.join(distPath, `${userScript}.raw.js.map`);
  await fsp.writeFile(devScriptSourcemapPath, devBundleSourceMap);

  if (userBundle !== undefined) {
    const userScriptPath = path.join(distPath, `${userScript}.user.js`);
    await fsp.writeFile(userScriptPath, userBundle);
  }
}

export default outputTask;
