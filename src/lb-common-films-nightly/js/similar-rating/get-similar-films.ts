import { MyFilmsX } from '../types';

function getSimilarFilms(targetRating: number, myFilms: MyFilmsX): [string, string][] {
  const similarFilms: [string, string][] = [];

  for (const [id, [rating, name]] of Object.entries(myFilms)) {
    if (targetRating === rating) {
      similarFilms.push([id, name]);
    }
  }

  similarFilms.sort(([, name], [, name_]) => {
    return name < name_ ? -1 : (name > name_ ? 1 : 0);
  });

  return similarFilms;
}

export default getSimilarFilms;
