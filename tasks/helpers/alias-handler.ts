import { initialConfig } from '../../utils/config-handler';

function getPossibleAlias(userScriptAlias: string): string {
  return userScriptAlias.split('-').at(0)!;
}

function getPossibleAliasValue(possibleAlias: string): string | undefined {
  return initialConfig.aliases?.[possibleAlias];
}

function getUserScriptName(alias: string, aliasValue: string, userScriptAlias: string): string {
  return userScriptAlias.replace(alias, aliasValue);
}

export { getPossibleAlias, getPossibleAliasValue, getUserScriptName };
