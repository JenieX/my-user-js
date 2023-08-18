import getIdentifier from '../get-identifier';
import { fish } from '../../../../helpers';

async function fetchIdentifier(filmLink: string): Promise<string> {
  const documentX = await fish.document(filmLink);

  return getIdentifier(documentX.body);
}

export default fetchIdentifier;
