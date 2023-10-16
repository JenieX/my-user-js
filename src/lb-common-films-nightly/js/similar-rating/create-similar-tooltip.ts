import createContainer from '../create-container';

function createSimilarTooltip(similarFilms: [string, string][], filmID: string): string {
  const { container, listElement, matchElement } = createContainer();
  matchElement.parentElement!.remove();
  listElement.style.setProperty('max-height', '50vh');

  for (const [id, name] of similarFilms) {
    const listItem = document.createElement('li');

    listItem.setAttribute('class', 'similar');

    listItem.innerHTML = `<a href="/film/${id}/" target="_blank">${name}</a>`;

    listElement.append(listItem);
    if (id === filmID) {
      (listItem.firstElementChild as HTMLAnchorElement).style.setProperty('color', '#00E054');
    }
  }

  return container.outerHTML;
}

export default createSimilarTooltip;
