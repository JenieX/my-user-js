import getFilmClassName from './get-film-class-name';
import { Film, MyRatedFilms } from './types';

const filmClassNames = ['way-off', 'off', 'close', 'match', 'prefect-match'];

function createTooltipContent(commonFilms: Film[], myRatedFilms: MyRatedFilms): string {
  let perfectPoints = 0;
  let userPoints = 0;

  let commonFilmsText = '<ul class="common-films">';

  for (const { title, rating: userRating, id } of commonFilms) {
    const myRating = myRatedFilms[id];
    if (myRating === undefined) {
      commonFilmsText += '<li class="not-rated">';
    } else {
      perfectPoints += 4;

      const filmClassName = getFilmClassName(userRating!, myRating);
      userPoints += filmClassNames.indexOf(filmClassName);

      commonFilmsText += `<li class="${filmClassName}" title="Your rating: ${myRating / 2}">`;
    }

    commonFilmsText += `<a href="${id}" target="_blank">${title} (${userRating! / 2})</a>`;

    commonFilmsText += '</li>';
  }

  commonFilmsText += '</ul>';

  const similarly = Math.floor((userPoints / perfectPoints) * 100);
  const matchElement = `<h3 class="common-match">Match: ${similarly}%</h3>`;

  return matchElement + commonFilmsText;
}

export default createTooltipContent;
