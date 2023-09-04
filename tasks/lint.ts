import { ESLint } from 'eslint';
import { LintTaskOptions } from './helpers/types';

async function lintTask({ devBundle, metadataBlock }: LintTaskOptions): Promise<string> {
  const eslintInstance = new ESLint({
    fix: true,
    useEslintrc: false,
    overrideConfig: {
      extends: ['@jeniex/eslint-config'],
      rules: {
        '@typescript-eslint/no-unsafe-argument': 0,
        '@typescript-eslint/no-unsafe-assignment': 0,
        '@typescript-eslint/no-unsafe-call': 0,
        '@typescript-eslint/no-unsafe-member-access': 0,
        '@typescript-eslint/no-unsafe-return': 0,
      },
    },
  });

  let userBundle = `${metadataBlock}\n${devBundle}`;
  userBundle = userBundle.replace(/\/\/# sourceMappingURL=.+/, '');

  const results = await eslintInstance.lintText(userBundle, {
    // A hack to bypass the `@typescript-eslint/parser` error.
    filePath: 'testing.js',
  });

  const lintedCode = results[0]!.output;

  const formatter = await eslintInstance.loadFormatter('stylish');
  const resultText = await formatter.format(results);
  if (resultText !== '') {
    console.log(resultText);
  }

  return lintedCode ?? userBundle;
}

export default lintTask;
