import typescript from '@rollup/plugin-typescript';

export default {
  input: './tasks/serve.ts',
  plugins: [typescript({ include: './tasks/serve.ts' })],
  external: [
    'node:fs',
    'node:fs/promises',
    'node:http',
    'node:path',
  ],
  output: {
    banner: '/* eslint-disable */\n',
    file: 'build/user-js-server.js',
    format: 'esm',
  },
};
