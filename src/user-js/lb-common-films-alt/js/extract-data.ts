import { $ } from '@jeniex/utils/browser';
import { Film } from './types';

function extractFilmData(posterElement: HTMLLIElement): Film {
  const title = $<HTMLImageElement>('img', posterElement).alt;
  const id = (posterElement.firstElementChild as HTMLDivElement).dataset.targetLink!;

  try {
    const ratingElement = $<HTMLSpanElement>('.rating', posterElement);
    const rating = Number(ratingElement.className.split('-').pop()!);

    return { title, id, rating };
  } catch {
    throw new Error(id);
  }
}

export default extractFilmData;
