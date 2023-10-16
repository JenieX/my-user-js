import { MyFilmsX } from '../types';

/**
 * Sets my films in the storage.
 */
function setFilms(myFilms: MyFilmsX): void {
  localStorage.setItem('my-films', JSON.stringify(myFilms));
}

export default setFilms;
