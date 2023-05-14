import cssnano from 'cssnano';
import fsp from 'node:fs/promises';
import path from 'node:path';
import postcss from 'postcss';
import sass from 'sass';
import listFiles from '../utils/list-files.js';
import { CSSTaskOptions } from './helpers/types';

async function cssTask({ userScript, distPath }: CSSTaskOptions): Promise<string[]> {
  /** The absolute path of the style folder of the provided user script */
  const styleFolderPath = path.resolve('src/user-js', userScript, 'css');

  /** A list of absolute paths to the style files located at the user script style folder */
  const styleFilesPaths = await listFiles({
    folderPath: styleFolderPath,
    getFullPath: true,
    filter: ['.scss'],
  });

  if (styleFilesPaths.length === 0) {
    return [];
  }

  const cssFiles: string[] = [];

  for (const styleFilePath of styleFilesPaths) {
    const styleName = path.basename(styleFilePath, '.scss');

    const { css } = sass.compile(styleFilePath);
    const cssFileName = `${styleName}.css`;
    await fsp.writeFile(path.join(distPath, cssFileName), css);
    cssFiles.push(cssFileName);

    const { css: cssMini } = await postcss([cssnano]).process(css, { from: undefined });
    const cssMinFileName = `${styleName}.min.css`;
    await fsp.writeFile(path.join(distPath, cssMinFileName), cssMini);
    cssFiles.push(cssMinFileName);
  }

  return cssFiles;
}

export default cssTask;
