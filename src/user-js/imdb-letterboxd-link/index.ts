import addKeyListener from './js/add-key-listener';
import createElement from './js/create-element';
import getIdentifier from './js/get-Identifier';
import getLink from './js/get-link';
import { LOG_ID, addStyle } from '../../helpers';

async function main(): Promise<void> {
  const imdbIdentifier = getIdentifier();

  // May throw an error!
  const link = await getLink(imdbIdentifier);

  await createElement(link);
  addKeyListener(link);

  addStyle('include-file: style.min.css');
}

main().catch((exception) => {
  console.error(LOG_ID, exception);
});
