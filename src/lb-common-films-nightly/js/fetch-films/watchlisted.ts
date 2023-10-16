import { $, $$, fish } from '@jeniex/utils/browser';
import extractData from '../extract-data';
import { Film, GetWatchlistFilmsOpt } from '../types';
import { addFilter, removeFilter } from '../cookies';

async function fetchWatchlistFilms({ link, collector }: GetWatchlistFilmsOpt): Promise<Film[]> {
  let reachedTheEnd = false;
  const films = collector ?? [];

  let documentX: Document;
  let container: HTMLUListElement;

  addFilter('show-watchlisted hide-watched');

  try {
    documentX = await fish.document(link);
  } catch (exception) {
    removeFilter();
    throw new Error((exception as Error).message);
  }

  removeFilter();

  try {
    container = $('.content-wrap ul.poster-list', documentX.body);
  } catch {
    return films;
  }

  const posterElements = $$<HTMLLIElement>('li[class="poster-container"]', container);

  for (const posterElement of posterElements) {
    const film = extractData(posterElement);

    if (film.rating === 0) {
      reachedTheEnd = true;
      break;
    }

    film.watchlisted = true;
    films.push(film);
  }

  const nextPageElement = documentX.querySelector('.paginate-nextprev > a.next');
  if (nextPageElement === null || reachedTheEnd === true) {
    return films;
  }

  const nextPageLink = (nextPageElement as HTMLAnchorElement).href;

  return fetchWatchlistFilms({ link: nextPageLink, collector: films });
}

export default fetchWatchlistFilms;
