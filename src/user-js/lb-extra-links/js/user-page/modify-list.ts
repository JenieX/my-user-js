import { $ } from '@jeniex/utils/browser';
import addActivity from './add-activity';
import addElements from './add-elements';
import fetchIdentifier from './fetch-identifier';
import { createItem } from '../create-items';

function modifyList(listElement: HTMLUListElement): void {
  const filmLinkElement = $('li.fm-film-page.popup-menu-text > a', listElement);
  const filmLink = (filmLinkElement as HTMLAnchorElement).href;

  // Cleanup
  filmLinkElement.parentElement!.remove();
  $('a[href^="/film/"][href$="/watch/"]', listElement).parentElement!.remove();

  // Adding the extra elements

  // Inspired by: https://github.com/theredsox/letterboxd
  addActivity(listElement);

  const loaderElement = createItem({
    label: 'Load extra links',
    className: 'popup-menu-text',
  });

  listElement.append(loaderElement);

  loaderElement.addEventListener('click', async (event): Promise<void> => {
    event.preventDefault();
    event.stopPropagation();

    loaderElement.firstElementChild!.textContent = 'Loading';

    try {
      const filmID = await fetchIdentifier(filmLink);
      addElements(listElement, filmID);
    } catch {}

    loaderElement.remove();
  }, { capture: true, once: true });
}

export default modifyList;
