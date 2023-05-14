function installationSectionTemplate(userScriptAlias: string): string {
  return `## Installation\n\nTo use this script, you'll need the [Violentmonkey](https://violentmonkey.github.io) extension installed in your browser. The script has been tested on both Chrome and Edge with Violentmonkey.\n\nOnce you have Violentmonkey installed, you can simply click on the following link:\n\n[Install this script](https://github.com/JenieX/user-js/raw/main/dist/${userScriptAlias}/${userScriptAlias}.user.js)\n\n`;
}

export default installationSectionTemplate;
