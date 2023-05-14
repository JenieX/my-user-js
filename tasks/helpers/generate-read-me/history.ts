function historySectionTemplate(userScriptAlias: string): string {
  return `## History\n\nTo see the commit history for this script, click [here](https://github.com/JenieX/user-js/commits/main?path=src/user-js/${userScriptAlias}).\n\n`;
}

export default historySectionTemplate;
