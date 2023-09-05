import { fish } from '@jeniex/utils/browser';
import getIdentifier from '../get-identifier';

async function fetchIdentifier(filmLink: string): Promise<string> {
  const documentX = await fish.document(filmLink);

  return getIdentifier(documentX.body);
}

export default fetchIdentifier;
