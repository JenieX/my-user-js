import { TAB_URL } from '../../../helpers';

function getIdentifier(): string {
  return TAB_URL.split('/')[4]!;
}

export default getIdentifier;
