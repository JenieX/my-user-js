import capitalizeWords from '../../../utils/capitalize-words';

function headerTemplate(userScript: string, userScriptAlias: string): string {
  const properUserScriptName = capitalizeWords(userScript.replaceAll('-', ' '));

  return `# [${properUserScriptName}](https://github.com/JenieX/user-js/tree/main/src/user-js/${userScriptAlias})\n\n`;
}

export default headerTemplate;
