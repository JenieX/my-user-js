import createContainer from './create-container';
import getFilmClassName from './get-film-class-name';
import { CreateTooltipOpt } from './types';

const filmClassNames = ['way-off', 'off', 'close', 'match', 'prefect-match'];

function createTooltip(options: CreateTooltipOpt): string {
  const { commonFilms, myRatedFilms, userFilmsLink, totalFilms } = options;
  let perfectPoints = 0;
  let userPoints = 0;

  const { container, listElement, matchElement, totalElement } = createContainer();

  for (const { title, rating: userRating, id } of commonFilms) {
    const listItem = document.createElement('li');
    const myRating = myRatedFilms[id];

    if (myRating !== undefined) {
      perfectPoints += 4;

      const filmClassName = getFilmClassName(userRating!, myRating);
      userPoints += filmClassNames.indexOf(filmClassName);

      listItem.setAttribute('class', filmClassName);
      listItem.setAttribute('title', `Your rating: ${myRating / 2}`);
    }

    listItem.innerHTML = `<a href="${id}" target="_blank">${title} (${userRating! / 2})</a>`;

    listElement.append(listItem);
  }

  matchElement.setAttribute('href', userFilmsLink);
  if (perfectPoints !== 0) {
    const similarly = Math.floor((userPoints / perfectPoints) * 100);
    matchElement.firstElementChild!.textContent = `Match: ${similarly}%`;
  }

  totalElement.textContent = totalFilms;

  return container.outerHTML;
}

export default createTooltip;
