import { Choice } from '../../utils/types';

/**
 * Create a list of user scripts choices to be used for checkbox prompt
 */
function createChoices(userScripts: string[], lastRunChoices: string[] | undefined): Choice[] {
  if (lastRunChoices === undefined) {
    return userScripts.map((userScript) => ({ name: userScript }));
  }

  const choices: Choice[] = userScripts.map((userScript) => {
    return {
      name: userScript,
      checked: (lastRunChoices as string[]).includes(userScript),
    };
  });

  return choices;
}

export default createChoices;
