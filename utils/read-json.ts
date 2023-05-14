import fsp from 'node:fs/promises';

async function readJSON<T= Record<string, any>>(fileAbsolutePath: string): Promise<T> {
  // eslint-disable-next-line unicorn/prefer-json-parse-buffer
  const metadataString = await fsp.readFile(fileAbsolutePath, 'utf-8');

  return JSON.parse(metadataString) as T;
}

export default readJSON;
