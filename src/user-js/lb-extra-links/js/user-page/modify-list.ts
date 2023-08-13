import { createItem } from '../create-items';
import fetchIdentifier from './fetch-identifier';

function modifyList(listElement: HTMLUListElement): void {
  const filmLink = (listElement.lastElementChild!.firstElementChild as HTMLAnchorElement).href;

  // Cleanup
  listElement.lastElementChild?.remove();
  listElement.lastElementChild?.remove();

  const loaderElement = createItem({
    label: 'Hover to load links',
    className: 'popup-menu-text',
  });

  const listener = async (): Promise<void> => {
    loaderElement.removeEventListener('mouseenter', listener);
    loaderElement.firstElementChild!.textContent = 'Loading';

    await fetchIdentifier(filmLink, listElement);
    loaderElement.remove();
  };

  listElement.append(loaderElement);
  loaderElement.addEventListener('mouseenter', listener);
}

export default modifyList;
