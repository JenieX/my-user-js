import { $, $$, fish } from '@jeniex/utils/browser';
import extractData from '../extract-data';
import { Film, GetMyFilmsOpt } from '../types';

async function fetchMyFilms({ link, collector }: GetMyFilmsOpt): Promise<Film[]> {
  const films = collector ?? [];

  const documentX = await fish.document(link, { credentials: 'omit' });

  let container: HTMLUListElement;

  try {
    container = $('.content-wrap ul.poster-list', documentX.body);
  } catch {
    return films;
  }

  const posterElements = $$<HTMLLIElement>('li[class="poster-container"]', container);

  for (const posterElement of posterElements) {
    films.push(extractData(posterElement));
  }

  const nextPageElement = documentX.querySelector('.paginate-nextprev > a.next');
  if (nextPageElement === null) {
    return films;
  }

  const nextPageLink = (nextPageElement as HTMLAnchorElement).href;

  return fetchMyFilms({ link: nextPageLink, collector: films });
}

export default fetchMyFilms;
