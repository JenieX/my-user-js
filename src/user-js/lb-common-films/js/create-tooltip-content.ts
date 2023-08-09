import getFilmClassName from './get-film-class-name';
import { Film, MyRatedFilms } from './types';

function createTooltipContent(commonFilms: Film[], myRatedFilms: MyRatedFilms): string {
  let commonFilmsText = '<ul class="common-films">';

  for (const { title, rating: userRating, id } of commonFilms) {
    const myRating = myRatedFilms[id];
    if (myRating === undefined) {
      commonFilmsText += '<li class="not-rated">';
    } else {
      const filmClassName = getFilmClassName(userRating!, myRating);
      commonFilmsText += `<li class="${filmClassName}" title="Your rating: ${myRating / 2}">`;
    }

    commonFilmsText += `<a href="${id}" target="_blank">${title} (${userRating! / 2})</a>`;

    commonFilmsText += '</li>';
  }

  commonFilmsText += '</ul>';

  return commonFilmsText;
}

export default createTooltipContent;
