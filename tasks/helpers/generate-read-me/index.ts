import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import contributingSectionTemplate from './contributing';
import descriptionSectionTemplate from './description';
import headerSectionTemplate from './header';
import historySectionTemplate from './history';
import installationSectionTemplate from './installation';
import licenseSectionTemplate from './license';
import limitationsSectionTemplate from './limitations';
import relatedScriptsSectionTemplate from './related';
import usageSectionTemplate from './usage';
import { GenerateReadMe } from '../types';

async function generateReadMe(options: GenerateReadMe): Promise<void> {
  const { userScript, userScriptAlias, description, usage, limitations, related } = options;

  let readMeContent = '';

  readMeContent += headerSectionTemplate(userScript, userScriptAlias);
  readMeContent += descriptionSectionTemplate(description);
  readMeContent += installationSectionTemplate(userScriptAlias);
  readMeContent += usageSectionTemplate(usage);

  // if (limitations !== undefined) {
  readMeContent += limitationsSectionTemplate(limitations);
  // }

  readMeContent += historySectionTemplate(userScriptAlias);

  if (related !== undefined) {
    readMeContent += relatedScriptsSectionTemplate(related);
  }

  readMeContent += contributingSectionTemplate;
  readMeContent += licenseSectionTemplate;

  /** The absolute path of the read me file of the provided user script */
  const readMeFilePath = path.resolve('src/user-js', userScriptAlias, 'README.md');
  if (fs.existsSync(readMeFilePath) === true) {
    await fsp.unlink(readMeFilePath);
  }

  await fsp.writeFile(readMeFilePath, readMeContent);
}

export default generateReadMe;
