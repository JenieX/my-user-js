import addAvatars from './js/add-avatars';
import fetchAvatars from './js/fetch-avatars';
import getElements from './js/get-elements';
import { addStyle } from '../../helpers';

async function main(): Promise<void> {
  const avatars = await fetchAvatars();
  const elements = getElements();

  addStyle('include-file: style.min.css');
  addAvatars({ avatars, elements });
}

main().catch((exception) => {
  console.error(exception);
});
