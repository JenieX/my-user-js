import fsp from 'node:fs/promises';

async function readJSON<T = object>(fileAbsolutePath: string): Promise<T> {
  const metadataString = await fsp.readFile(fileAbsolutePath, 'utf-8');

  return JSON.parse(metadataString) as T;
}

export default readJSON;
