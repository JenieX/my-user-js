import { logId } from '@jeniex/utils/browser';
import { Films, StorageCommonFilms } from '../types';

function getCommonFilms(user: string): Films | undefined {
  const commonFilmsData = localStorage.getItem(`common-films-${user}`);

  if (commonFilmsData === null) {
    return undefined;
  }

  const { expires, films, total } = JSON.parse(commonFilmsData) as StorageCommonFilms;
  const currentTimestamp = Date.now();

  if (currentTimestamp > expires) {
    console.warn(logId, `Stored data for "${user}" got expired, fetching fresh data..`);

    return undefined;
  }

  const commonFilms: Films = films;
  commonFilms.totalFilms = total;

  return commonFilms;
}

export default getCommonFilms;
