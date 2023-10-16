import { getMyAccount } from './cookies';

const IS_ANDROID = window.navigator.userAgent.includes('Android');
const MY_ACCOUNT = getMyAccount();

export {
  IS_ANDROID,
  MY_ACCOUNT,
};
