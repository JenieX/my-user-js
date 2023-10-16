import { logId, addStyle } from '@jeniex/utils/browser';
import addKeyListener from './js/add-key-listener';
import createElement from './js/create-element';
import getIdentifier from './js/get-Identifier';
import getLink from './js/get-link';

// TODO Allow script on trailers pages by exposing LB link inside session storage.

async function main(): Promise<void> {
  const imdbIdentifier = getIdentifier();

  // May throw an error!
  const link = await getLink(imdbIdentifier);

  await createElement(link);
  addKeyListener(link);

  addStyle('include-file: style.min.css');
}

main().catch((exception) => {
  console.error(logId, exception);
});
