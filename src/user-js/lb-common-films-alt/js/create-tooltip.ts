import getFilmClassName from './get-film-class-name';
import { $ } from '../../../helpers';
import { CreateTooltipOpt, TooltipElements } from './types';

const filmClassNames = ['way-off', 'off', 'close', 'match', 'prefect-match'];

function createContainer(): TooltipElements {
  const container = document.createElement('div');
  container.innerHTML = 'include-file: container.html';
  container.setAttribute('class', 'common-films');

  return {
    container,
    matchElement: $('#common-films-match', container),
    // totalElement: $('#common-films-total', container),
    listElement: $('#common-films-list', container),
  };
}

// function createListItem(): HTMLLIElement {
//   const listItem = document.createElement('li');

//   return listItem;
// }

function createTooltip(options: CreateTooltipOpt): string {
  const { commonFilms, myRatedFilms, userFilmsLink } = options;
  let perfectPoints = 0;
  let userPoints = 0;

  const { container, matchElement, listElement } = createContainer();

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

  return container.outerHTML;
}

export default createTooltip;
