import { $ } from '@jeniex/utils/browser';
import { Film } from './types';

function extractFilmData(posterElement: HTMLLIElement): Film {
  const name = $<HTMLImageElement>('img', posterElement).alt;
  const id = (posterElement.firstElementChild as HTMLDivElement).dataset.targetLink!;

  const film: Film = {
    name,
    id: id.slice(6, -1),
    rating: 0,
  };

  try {
    const ratingElement = $<HTMLSpanElement>('.rating', posterElement);
    const rating = Number(ratingElement.className.split('-').pop()!) as Film['rating'];

    film.rating = rating;
  } catch {}

  return film;
}

export default extractFilmData;
