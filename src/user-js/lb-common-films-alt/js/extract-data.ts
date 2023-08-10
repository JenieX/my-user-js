import { $ } from '../../../helpers';
import { Film } from './types';

function extractFilmData(posterElement: HTMLLIElement): Film {
  const title = $<HTMLImageElement>('img', posterElement).alt;
  const id = (posterElement.firstElementChild as HTMLDivElement).dataset.targetLink!;

  // Next line could crash the scope
  const ratingElement = $<HTMLSpanElement>('.rating', posterElement);
  const rating = Number(ratingElement.className.split('-').pop()!);

  return { title, id, rating };
}

export default extractFilmData;
