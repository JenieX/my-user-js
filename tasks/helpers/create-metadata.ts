import getPackage from '../../utils/get-package';
import type { JSONLike, Strings } from '../../utils/types';
import type { UserScriptSpecificMetaData } from './types';

const { author, homepage, bugs, license } = await getPackage();

function createMetaData(options: UserScriptSpecificMetaData, alias: string): JSONLike<Strings> {
  const { name, version, description, match, runAt, icon } = options;

  return {
    name,
    version,
    namespace: homepage,
    description,
    author,
    match,
    grant: options.grant,
    require: options.require,
    'run-at': runAt,
    noframes: '',
    compatible: ['edge Violentmonkey', 'chrome Violentmonkey'],
    supportURL: bugs,
    homepageURL: `${homepage}/tree/main/src/user-js/${alias}`,
    updateURL: `${homepage}/raw/main/dist/${alias}/${alias}.meta.js`,
    downloadURL: `${homepage}/raw/main/dist/${alias}/${alias}.user.js`,
    icon,
    license,
  };
}

export default createMetaData;

// 'GM.deleteValue',
// 'GM.getValue',
// 'GM.registerMenuCommand',
// 'GM.setValue',
// 'GM_addValueChangeListener',
//
// 'GM.addElement',
// 'GM.addStyle',
// 'GM.getResourceUrl',
// 'GM.info',
// 'GM.listValues',
// 'GM.notification',
// 'GM.openInTab',
// 'GM.setClipboard',
// 'GM.xmlHttpRequest',
