import extractData from './extract-data';
import { $, $$, fish } from '../../../helpers';
import { Films, GetFilmsOpt } from './types';

async function getFilms({ link, collector, myFilmsIDs }: GetFilmsOpt): Promise<Films> {
  // eslint-disable-next-line prefer-const
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
    try {
      const film = extractData(posterElement);
      if (!myFilmsIDs.has(film.id)) {
        reachedTheEnd = true;
        break;
      }

      films.push(film);
    } catch (exception: unknown) {
      const id = (exception as Error).message;
      if (!myFilmsIDs.has(id)) {
        reachedTheEnd = true;
        break;
      }
    }
  }

  const nextPageElement = documentX.querySelector('.paginate-nextprev > a.next');
  if (nextPageElement === null || reachedTheEnd === true) {
    const totalElement = $<HTMLAnchorElement>('.sub-nav > .selected > a', documentX.body);
    const totalFilms = totalElement.title;

    films.totalFilms = totalFilms;

    return films;
  }

  const nextPageLink = (nextPageElement as HTMLAnchorElement).href;

  return getFilms({ link: nextPageLink, collector: films, myFilmsIDs });
}

export default getFilms;
