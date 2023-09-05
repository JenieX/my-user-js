import { tabURL } from '@jeniex/utils/browser';

function getIdentifier(): string {
  return tabURL.split('/')[4]!;
}

export default getIdentifier;
