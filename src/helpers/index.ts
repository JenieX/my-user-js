export { $, $$ } from './query-selector';
export { default as addStyle } from './add-style';
export { default as fish } from './fish';
export { default as sleep } from './sleep';
export { default as waitForImageLoad } from './wait-for-image-load';
export { alert, confirm, prompt } from './dialogs';

/** The identifier of the script to be used in logging */
const LOG_ID = `[${GM.info.script.name}]:`;

/** The initial tab URL on the script run */
const TAB_URL = window.location.href;

export {
  LOG_ID,
  TAB_URL,
};
