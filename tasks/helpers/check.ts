import type { UserScriptSpecificMetaData } from './types';
import { getPossibleAlias, getPossibleAliasValue, getUserScriptName } from './alias-handler';

export function checkNameAgainstAlias(userScriptName: string, userScriptAlias: string): void {
  const possibleAlias = getPossibleAlias(userScriptAlias);
  const aliasValue = getPossibleAliasValue(possibleAlias);

  let userScriptNameOrAlias = userScriptAlias;

  if (aliasValue !== undefined) {
    userScriptNameOrAlias = getUserScriptName(possibleAlias, aliasValue, userScriptAlias);
  }

  if (userScriptName !== userScriptNameOrAlias) {
    throw new Error('Mismatched between the script folder name and its name');
  }
}

export function checkRequiredMetadataItems(metadata: UserScriptSpecificMetaData): void {
  const requiredItems = ['name', 'version', 'description', 'match', 'runAt', 'icon'] as const;

  for (const key of requiredItems) {
    if (metadata[key] === undefined) {
      throw new Error(`The required metadata item "${key}" is missing`);
    }
  }
}

export function checkRequiredDocsItems(metadata: UserScriptSpecificMetaData): void {
  if (metadata.docs === undefined) {
    throw new Error('This user script does not have the docs property in its metadata file');
  }

  const requiredItems = ['description', 'usage', 'limitations'] as const;

  for (const key of requiredItems) {
    if (metadata.docs[key] === undefined) {
      throw new Error(`The required docs item "${key}" is missing`);
    }
  }
}
