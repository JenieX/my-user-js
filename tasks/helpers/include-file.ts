import fsp from 'node:fs/promises';
import path from 'node:path';
import MagicString, { SourceMap } from 'magic-string';
import { IncludeFileOptions } from './types';

async function includeFile(options: IncludeFileOptions): Promise<[string, SourceMap]> {
  const { distPath, renderedCode, files } = options;

  const magicStringInstance = new MagicString(renderedCode);

  for (const fileName of files) {
    if (renderedCode.includes(`include-file: ${fileName}`)) {
      const fileContent = await fsp.readFile(path.join(distPath, fileName), 'utf-8');

      let fileIncludeString = '';
      fileIncludeString += '(  )?include-file: ';
      fileIncludeString += fileName.replaceAll('.', '\\.');

      const fileIncludeRegexp = new RegExp(fileIncludeString);
      magicStringInstance.replace(fileIncludeRegexp, fileContent);
    }
  }

  const map = magicStringInstance.generateMap({ hires: true });
  const finalBundle = magicStringInstance.toString();

  return [finalBundle, map];
}

export default includeFile;
