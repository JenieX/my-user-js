import fsp from 'node:fs/promises';
import path from 'node:path';
import { JSONLike } from './types';

async function getPackage(): Promise<JSONLike<string>> {
  const packageAbsolutePath = path.resolve('package.json');

  // eslint-disable-next-line unicorn/prefer-json-parse-buffer
  const packageString = await fsp.readFile(packageAbsolutePath, 'utf-8');

  return JSON.parse(packageString) as JSONLike<string>;
}

export default getPackage;
