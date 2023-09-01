import getPackage from '../../utils/get-package';
import { JSONLike, Strings } from '../../utils/types';
import { UserScriptSpecificMetaData } from './types';

const { author, homepage, bugs, license } = await getPackage();

function createMetaData(options: UserScriptSpecificMetaData, alias: string): JSONLike<Strings> {
  const {
    name,
    version,
    description,
    match,
    excludeMatch,
    include,
    exclude,
    runAt,
    icon,
  } = options;

  return {
    name,
    version,
    namespace: homepage,
    description,
    author,
    match,
    excludeMatch,
    include,
    exclude,
    grant: options.grant,
    require: options.require,
    resource: options.resource,
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
