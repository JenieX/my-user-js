const SCRIPT_NAME = (typeof GM === 'undefined' ? GM_info : GM.info).script.name;

/** The identifier of the script to be used in logging */
const LOG_ID = `[${SCRIPT_NAME}]:`;

/** The initial tab URL on the script run */
const TAB_URL = window.location.href;

export {
  LOG_ID,
  SCRIPT_NAME,
  TAB_URL,
};
