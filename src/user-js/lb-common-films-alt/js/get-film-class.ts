import { FilmClass } from './types';

const filmClasses = ['way-off', 'off', 'close', 'match', 'great-match'] as const;

function getFilmClass(myRating: number, userRating: number): FilmClass {
  const average = (myRating + userRating) / 2;
  const difference = Math.abs(userRating - average) * 2;

  let className;

  switch (true) {
    case (difference <= 1): {
      className = filmClasses[4];
      break;
    }

    case (difference <= 3): {
      className = filmClasses[3];
      break;
    }

    case (difference <= 5): {
      className = filmClasses[2];
      break;
    }

    case (difference <= 7): {
      className = filmClasses[1];
      break;
    }

    default: {
      className = filmClasses[0];
      break;
    }
  }

  return className;
}

export { filmClasses };
export default getFilmClass;
