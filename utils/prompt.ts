import inquirer from 'inquirer';
import type { Choice } from './types';

// eslint-disable-next-line import/prefer-default-export
export async function checkbox(message: string, choices: Choice[]): Promise<Choice['value'][]> {
  const { selectedChoices } = await inquirer.prompt([
    {
      type: 'checkbox',
      message,
      name: 'selectedChoices',
      choices,
      async validate(answer: any[]): Promise<boolean | string> {
        if (answer.length === 0) {
          return 'You must choose at least one choice.';
        }

        return true;
      },
    },
  ]) as { [key: string]: Choice['value'][] };

  return selectedChoices!;
}
