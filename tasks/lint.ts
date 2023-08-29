import { ESLint } from 'eslint';
import { LintTaskOptions } from './helpers/types';

async function lintTask({ devBundle, metadataBlock }: LintTaskOptions): Promise<string> {
  const eslintInstance = new ESLint({
    fix: true,
    useEslintrc: false,
    overrideConfig: {
      extends: ['@jeniex/eslint-config-js'],
      /**
       * // TODO
       * Rules that are listed below, are to be added to '@jeniex/eslint-config-js', once
       * there are few of theme
       */
      rules: {
        // temp. Workaround for the JS version of " @typescript-eslint/naming-convention".
        // https://github.com/iamturns/eslint-config-airbnb-typescript/blob/master/lib/shared.js
        camelcase: 0,

        'no-use-before-define': [2, { functions: false }],
        'prefer-destructuring': [
          2,
          {
            VariableDeclarator: { array: false, object: true },
            AssignmentExpression: { array: false, object: false },
          },
          { enforceForRenamedProperties: false },
        ],

        'unicorn/no-unused-properties': 1,
      },
    },
  });

  let userBundle = `${metadataBlock}\n${devBundle}`;
  userBundle = userBundle.replace('/* eslint-disable */', '');
  // userBundle = userBundle.replaceAll(/\/\/ (?:eslint-disable|@ts-).+/gm, '');
  userBundle = userBundle.replace(/\/\/# sourceMappingURL=.+/, '');

  const results = await eslintInstance.lintText(userBundle /* { filePath: 'test.js' } */);
  const lintedCode = results[0]!.output;

  const formatter = await eslintInstance.loadFormatter('stylish');
  const resultText = await formatter.format(results);
  if (resultText !== '') {
    console.log(resultText);
  }

  return lintedCode ?? userBundle;
}

export default lintTask;
