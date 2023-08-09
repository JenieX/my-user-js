import { $, $$, fish } from '../../../helpers';
import { Film } from './types';

async function getUserFilms(userFilmsLink: string, collector?: Film[]): Promise<Film[]> {
  const onlyRatedFilms = userFilmsLink.includes('by/entry-rating');
  let reachedTheEndOfRatedFilms = false;
  const films = collector ?? [];

  const documentX = await fish.document(userFilmsLink);
  let container: HTMLUListElement;

  try {
    container = $('.content-wrap ul.poster-list', documentX.body);
  } catch {
    return films;
  }

  const posterElements = $$<HTMLLIElement>('li[class="poster-container"]', container);

  for (const posterElement of posterElements) {
    const film: Film = {
      title: $<HTMLImageElement>('img', posterElement).alt,
      id: (posterElement.firstElementChild as HTMLDivElement).dataset.targetLink!,
    };

    try {
      const ratingElement = $<HTMLSpanElement>('.rating', posterElement);
      const rating = ratingElement.className.split('-').pop()!;
      film.rating = Number(rating);
    } catch {
      if (onlyRatedFilms === true) {
        reachedTheEndOfRatedFilms = true;

        break;
      }
    }

    films.push(film);
  }

  const nextPageElement = documentX.querySelector('.paginate-nextprev > a.next');
  if (nextPageElement === null || reachedTheEndOfRatedFilms === true) {
    return films;
  }

  const nextPageLink = (nextPageElement as HTMLAnchorElement).href;

  return getUserFilms(nextPageLink, films);
}

export default getUserFilms;
