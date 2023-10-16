import { MyFilmsX } from '../types';

/**
 * Gets my films from the storage
 */
function getFilms(): MyFilmsX {
  const filmsData = localStorage.getItem('my-films');

  if (filmsData === null) {
    throw new Error('storage films db is empty, use the "Refresh storage films" option.');
  }

  const films = JSON.parse(filmsData) as MyFilmsX;

  return films;
}

export default getFilms;
