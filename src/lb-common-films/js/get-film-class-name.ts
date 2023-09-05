import { FilmClassName } from './types';

function getFilmClassName(myRating: number, userRating: number): FilmClassName {
  const average = (myRating + userRating) / 2;
  const difference = Math.abs(userRating - average);

  let className;

  switch (true) {
    case (difference === 0): {
      className = 'prefect-match' as const;
      break;
    }

    case (difference === 0.5): {
      className = 'match' as const;
      break;
    }

    case (difference === 1 || difference === 1.5): {
      className = 'close' as const;
      break;
    }

    case (difference >= 2 && difference <= 3): {
      className = 'off' as const;
      break;
    }

    default: {
      className = 'way-off' as const;
      break;
    }
  }

  return className;
}

export default getFilmClassName;
