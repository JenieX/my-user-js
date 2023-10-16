import rate from './rate';
import { MarkAsNotWatched, MarkAsWatched } from '../types';
import { getFilms, setFilms } from '../storage';

async function markAsWatched({ id, name }: MarkAsWatched): Promise<void> {
  await rate({ id, rating: 0, name });
}

async function markAsNotWatched({ id }: MarkAsNotWatched): Promise<void> {
  const myFilms = getFilms();

  if (myFilms === undefined) {
    return;
  }

  if (myFilms[id] === undefined) {
    return;
  }

  delete myFilms[id];

  // @Xts-expect-error
  // watchedFilms[filmID] = undefined;

  setFilms(myFilms);
}

export { markAsWatched, markAsNotWatched };
