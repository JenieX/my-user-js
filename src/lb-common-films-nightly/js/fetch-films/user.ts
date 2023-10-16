import { $, $$, fish } from '@jeniex/utils/browser';
import extractData from '../extract-data';
import { Films, GetFilmsOpt } from '../types';
import { addFilter, removeFilter } from '../cookies';

async function fetchFilms({ link, collector }: GetFilmsOpt): Promise<Films> {
  const films = collector ?? [];

  /** The remote document containing only the user films that you have watched */
  let documentX: Document;

  /** The container (ul) element of the posters (li) elements  */
  let container: HTMLUListElement;

  addFilter('show-watched');

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
    // FIXME probably needs a fix for the case of someone who have watched all your films
    // but didn't rate any. It needs to break on first zero rated!
    if (film.rating !== 0) {
      films.push(film);
    }
  }

  const nextPageElement = documentX.querySelector('.paginate-nextprev > a.next');
  if (nextPageElement === null) {
    const totalElement = $<HTMLAnchorElement>('.sub-nav > .selected > a', documentX.body);
    const totalFilms = totalElement.title;

    films.totalFilms = totalFilms;

    return films;
  }

  const nextPageLink = (nextPageElement as HTMLAnchorElement).href;

  return fetchFilms({ link: nextPageLink, collector: films });
}

export default fetchFilms;
