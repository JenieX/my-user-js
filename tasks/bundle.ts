import { rollup, Plugin, RenderChunkHook } from 'rollup';
import fs from 'node:fs';
import typescript from '@rollup/plugin-typescript';
import path from 'node:path';
import { BundleTaskOptions } from './helpers/types';
import includeFile from './helpers/include-file';
// import externalGlobals from 'rollup-plugin-external-globals';

function replacement({ distPath, files }: BundleTaskOptions): Plugin {
  return {
    name: 'transform-code',
    async renderChunk(code): Promise<ReturnType<RenderChunkHook>> {
      if (files.length === 0) {
        // eslint-disable-next-line unicorn/no-null
        return null;
      }

      const [updatedCode, sourceMap] = await includeFile({
        distPath,
        renderedCode: code,
        files,
      });

      return { code: updatedCode, map: sourceMap };
    },
  };
}

async function bundleTask(options: BundleTaskOptions): Promise<[string, string]> {
  const { userScript, distPath, files } = options;

  /** The absolute path of the index file of the provided user script */
  const indexFilePath = path.resolve('src/user-js', userScript, 'index.ts');

  if (fs.existsSync(indexFilePath) === false) {
    throw new Error('This user script does not have an index file');
  }

  const bundle = await rollup({
    input: indexFilePath,
    plugins: [
      typescript({
        include: [
          './src/helpers/*.ts',
          `./src/user-js/${userScript}/**/*.ts`,
        ],
      }),
      replacement({ userScript, distPath, files }),
    ],
  });

  const result = await bundle.generate({
    banner: '/* eslint-disable */\n',
    sourcemap: true,
    sourcemapPathTransform: (relativeSourcePath) => {
      return `..\\${relativeSourcePath}`;
    },
  });

  await bundle.close();

  const [{ code, map }] = result.output;

  const sourcemapURL = `http://localhost:1011/${userScript}/map?v=${Date.now()}`;

  return [
    code.replace('index.js.map', sourcemapURL),
    JSON.stringify(map),
  ];
}

export default bundleTask;
