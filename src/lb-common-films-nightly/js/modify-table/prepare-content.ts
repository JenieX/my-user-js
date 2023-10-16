import { $, $$ } from '@jeniex/utils/browser';
import evaluateFilms from '../evaluate-films';
import { SetContentOpt } from '../types';
import { getCommonFilms } from '../storage';

/**
 * Sets the content of match and common elements in the table.
 */
function setContent({ rowElement, match, common }: SetContentOpt): void {
  const matchElement = $('.icon-link', rowElement);
  matchElement.lastChild!.textContent = `${match}%`;

  const commonElement = $('.icon-common', rowElement);
  commonElement.lastChild!.textContent = common.toString();
}

function prepareContent(): void {
  const rowElements = $$<HTMLTableRowElement>('.person-table > tbody > tr');

  for (const rowElement of rowElements) {
    const avatarElement = $<HTMLAnchorElement>('a.avatar', rowElement);
    const user = avatarElement.getAttribute('href')!.slice(1, -1);
    const commonFilms = getCommonFilms(user);

    if (commonFilms !== undefined) {
      const { match, common } = evaluateFilms({ commonFilms, sortByName: false });

      setContent({ rowElement, match, common });
    }
  }
}

export default prepareContent;
