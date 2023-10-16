import { FilmPoints } from './types';

function getFilmPoints(myRating: number, userRating: number): FilmPoints {
  const average = (myRating + userRating) / 2;
  const difference = Math.abs(userRating - average) * 2;

  let points: FilmPoints;

  switch (true) {
    case (difference <= 1): {
      points = 4;
      break;
    }

    case (difference <= 3): {
      points = 3;
      break;
    }

    case (difference <= 5): {
      points = 2;
      break;
    }

    case (difference <= 7): {
      points = 1;
      break;
    }

    default: {
      points = 0;
      break;
    }
  }

  return points;
}

export default getFilmPoints;
