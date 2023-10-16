import createContainer from './create-container';
import { CreateTooltipContentOpt } from './types';

function createTooltipContent(options: CreateTooltipContentOpt): string {
  const { evaluatedFilms, user, totalFilms } = options;

  const { container, listElement, matchElement, totalElement } = createContainer();

  for (const { name, id, rating, label, myRating } of evaluatedFilms) {
    const itemElement = document.createElement('li');

    itemElement.setAttribute('class', label);

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', `/film/${id}/`);
    linkElement.setAttribute('target', 'target');
    linkElement.textContent = `${name} (${rating / 2})`;

    if (myRating !== undefined) {
      linkElement.setAttribute('title', `Your rating: ${myRating / 2}`);
    }

    itemElement.append(linkElement);
    listElement.append(itemElement);
  }

  matchElement.setAttribute('href', `https://letterboxd.com/${user}/films/by/entry-rating/`);

  matchElement.firstElementChild!.textContent = `Match: ${evaluatedFilms.match}%`;

  totalElement.textContent = totalFilms;

  return container.outerHTML;
}

export default createTooltipContent;
