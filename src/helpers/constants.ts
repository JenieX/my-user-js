/** The identifier of the script to be used in logging */
const LOG_ID = `[${GM.info.script.name}]:`;

/** The initial tab URL on the script run */
const TAB_URL = window.location.href;

const IS_ANDROID = window.navigator.userAgent.includes('Android');

export {
  LOG_ID,
  TAB_URL,
  IS_ANDROID,
};
