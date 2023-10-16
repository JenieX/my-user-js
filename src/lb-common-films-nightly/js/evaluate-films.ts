import getFilmPoints from './get-film-points';
import { EvaluateFilmsOpt, EvaluatedFilms } from './types';
import { getFilms } from './storage';

const labels = ['way-off', 'off', 'close', 'match', 'great-match'] as const;

function evaluateFilms({ commonFilms, sortByName, filter }: EvaluateFilmsOpt): EvaluatedFilms {
  const myFilms = getFilms();

  let totalCommon = 0;
  let perfectPoints = 0;
  let userPoints = 0;

  const evaluatedFilms: EvaluatedFilms = Object.assign([], { match: 0, common: 0 });

  for (const { name, id, rating, watchlisted } of commonFilms) {
    if (watchlisted === true) {
      if (/* filter === undefined || */ filter === 'watchlisted') {
        const label = 'watchlisted';
        evaluatedFilms.push({ name, id, rating, label });
      }
    } else {
      totalCommon += 1;
      // try {
      //   const [myRating] = myFilms[id]!;
      // } catch {
      //   throw new Error('Your films local data are outdated');
      // }

      // console.log({ name, id, rating, watchlisted });

      const [myRating] = myFilms[id]!;

      /** A film that I have watched but not rated. */
      if (myRating === 0) {
        if (filter === undefined || filter === 'not-rated') {
          const label = 'not-rated';

          evaluatedFilms.push({ name, id, rating, label });
        }
      } else {
        const points = getFilmPoints(rating, myRating);

        perfectPoints += 4;
        userPoints += points;

        if (filter === undefined || filter === points) {
          const label = labels[points];

          evaluatedFilms.push({ name, id, rating, label, myRating });
        }
      }
    }
  }

  let match = 0;
  if (perfectPoints !== 0) {
    match = Math.floor((userPoints / perfectPoints) * 100);
  }

  if (sortByName === true) {
    evaluatedFilms.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }

      if (a.name > b.name) {
        return 1;
      }

      return 0;
    });
  }

  evaluatedFilms.match = match;
  evaluatedFilms.common = totalCommon;

  return evaluatedFilms;
}

export default evaluateFilms;
