import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import type { JSONLike } from './types';

const configPath = path.resolve('./config.json');

export async function getConfig(): Promise<JSONLike<any>> {
  const configFileExists = fs.existsSync(configPath);

  if (configFileExists === false) {
    await fsp.writeFile(configPath, '{}');

    return {};
  }

  // eslint-disable-next-line unicorn/prefer-json-parse-buffer
  const configString = await fsp.readFile(configPath, 'utf-8');
  const config = JSON.parse(configString) as JSONLike<any>;

  return config;
}

export async function setConfig(config: JSONLike<any>): Promise<void> {
  await fsp.writeFile(configPath, JSON.stringify(config));
}
