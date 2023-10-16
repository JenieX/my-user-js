import { StorageCommonFilms } from '../types';

function getUsersInStorage(): string[] {
  const storageKeys = Object.keys(localStorage);
  const usersInStorage = storageKeys.filter((key) => key.startsWith('common-films-'));

  return usersInStorage;
}

function clearExpired(): void {
  const currentTimestamp = Date.now();
  const usersInStorage = getUsersInStorage();

  for (const userKey of usersInStorage) {
    const commonFilmsData = localStorage.getItem(userKey);

    const { expires } = JSON.parse(commonFilmsData!) as StorageCommonFilms;

    if (currentTimestamp > expires) {
      console.warn(`Stored data for "${userKey}" got expired, fetching fresh data..`);
      localStorage.removeItem(userKey);
    }
  }
}

export default clearExpired;
