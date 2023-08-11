import extractData from './extract-data';
import { $, $$, fish } from '../../../helpers';
import { Film, GetMyFilmsOpt } from './types';

async function getMyFilms({ link, collector }: GetMyFilmsOpt): Promise<Film[]> {
  let reachedTheEnd = false;
  const films = collector ?? [];

  const documentX = await fish.document(link);
  let container: HTMLUListElement;

  try {
    container = $('.content-wrap ul.poster-list', documentX.body);
  } catch {
    return films;
  }

  const posterElements = $$<HTMLLIElement>('li[class="poster-container"]', container);

  for (const posterElement of posterElements) {
    let film: Film;

    try {
      film = extractData(posterElement);
    } catch {
      // const firstNotRatedFilm = (exception as Error).message;
      reachedTheEnd = true;

      break;
    }

    films.push(film);
  }

  const nextPageElement = documentX.querySelector('.paginate-nextprev > a.next');
  if (nextPageElement === null || reachedTheEnd === true) {
    return films;
  }

  const nextPageLink = (nextPageElement as HTMLAnchorElement).href;

  return getMyFilms({ link: nextPageLink, collector: films });
}

export default getMyFilms;
