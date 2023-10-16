import { logId } from '@jeniex/utils/browser';
import { Cookies } from '../libraries';

function getMyAccount(): string {
  const myAccount = Cookies.get('letterboxd.signed.in.as');

  if (myAccount === undefined) {
    throw new Error(`${logId} You must be logged in to use this user script`);
  }

  return myAccount;
}

export default getMyAccount;
