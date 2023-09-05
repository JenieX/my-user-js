import { $, tabURL } from '@jeniex/utils/browser';
import { createItem } from '../create-items';

const username = tabURL.split('/')[3]!;
let isMyPage = false;

/**
 * Adds the user activity link for that film
 */
function addActivity(listElement: HTMLUListElement): void {
  if (isMyPage) {
    return;
  }

  const myActivityLinkElement = $('.fm-show-activity.popup-menu-text > a', listElement);
  const myActivityLink = myActivityLinkElement.getAttribute('href')!;

  if (myActivityLink.startsWith(`/${username}`)) {
    isMyPage = true;

    return;
  }

  const userActivityTemplate = `/%s/${myActivityLink.split('/').slice(2, -1).join('/')}`;

  const userActivityElement = createItem({
    label: 'Show user activity',
    template: userActivityTemplate,
    replacement: username,
    className: 'popup-menu-text',
  });

  myActivityLinkElement.parentElement!.insertAdjacentElement('afterend', userActivityElement);
}

export default addActivity;
