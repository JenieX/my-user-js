import createItems from '../create-items';

function addElements(parent: HTMLUListElement, filmID: string): void {
  const extraElements = createItems(filmID, 'popup-menu-text');

  for (const extraElement of extraElements) {
    parent.append(extraElement);
  }
}

export default addElements;
