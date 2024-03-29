import capitalizeWords from '../../../utils/capitalize-words';
import { RelatedScripts } from '../types';

function relatedScriptsSectionTemplate(relatedScripts: RelatedScripts[]): string {
  let relatedScriptsSection = '';

  relatedScriptsSection += '## Related Scripts\n\n';

  for (const { userScript, userScriptAlias } of relatedScripts) {
    const properUserScriptName = capitalizeWords(userScript.replaceAll('-', ' '));
    relatedScriptsSection += `- [${properUserScriptName}](https://github.com/JenieX/user-js/tree/main/src/${userScriptAlias})\n`;
  }

  relatedScriptsSection += '\n';

  return relatedScriptsSection;
}

export default relatedScriptsSectionTemplate;
