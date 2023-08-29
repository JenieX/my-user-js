import createElement from './js/create-element';
import getIdentifier from './js/get-Identifier';
import getLink from './js/get-link';
import { addStyle } from '../../helpers';

async function main(): Promise<void> {
  const imdbIdentifier = getIdentifier();
  const link = await getLink(imdbIdentifier);

  createElement(link);

  addStyle('include-file: style.min.css');
}

main().catch((exception) => {
  console.error(exception);
});
