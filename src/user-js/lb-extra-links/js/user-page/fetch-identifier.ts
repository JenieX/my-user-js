import addElements from './add-elements';
import getIdentifier from '../get-identifier';
import { fish } from '../../../../helpers';

async function fetchIdentifier(filmLink: string, listElement: HTMLUListElement): Promise<void> {
  const documentX = await fish.document(filmLink);

  try {
    const filmID = getIdentifier(documentX.body);
    addElements(listElement, filmID);
  } catch {}
}

export default fetchIdentifier;
