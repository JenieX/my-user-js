import { Films, StorageCommonFilms } from '../types';

function setCommonFilms(user: string, commonFilms: Films): void {
  const currentDate = new Date();

  // Add two days
  currentDate.setDate(currentDate.getDate() + 2);

  // Add one minute
  // currentDate.setMinutes(currentDate.getMinutes() + 1);

  const readyData: StorageCommonFilms = {
    films: commonFilms,
    total: commonFilms.totalFilms!,
    expires: currentDate.getTime(),
  };

  localStorage.setItem(`common-films-${user}`, JSON.stringify(readyData));
}

export default setCommonFilms;
