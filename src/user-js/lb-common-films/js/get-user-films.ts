import { $, $$, fish, sleep } from '../../../helpers';
import { Film } from './types';

async function getUserFilms(userFilmsLink: string, collector?: Film[]): Promise<Film[]> {
  const films = collector ?? [];

  const documentX = await fish.document(userFilmsLink);
  const container = $<HTMLUListElement>('.content-wrap ul.poster-list', documentX.body);
  const elements = $$<HTMLLIElement>('li[class="poster-container"]', container);

  for (const element of elements) {
    const film: Film = {
      title: $<HTMLImageElement>('img', element).alt,
      id: (element.firstElementChild as HTMLDivElement).dataset.filmId!,
    };

    try {
      const ratingElement = $<HTMLSpanElement>('.rating', element);
      const rating = ratingElement.className.split('-').pop()!;
      film.rating = Number(rating);
    } catch {}

    films.push(film);
  }

  const nextPageElement = documentX.querySelector('.paginate-nextprev > a.next');
  if (nextPageElement === null) {
    return films;
  }

  await sleep(500);
  const nextPageLink = (nextPageElement as HTMLAnchorElement).href;

  return getUserFilms(nextPageLink, films);
}

export default getUserFilms;
