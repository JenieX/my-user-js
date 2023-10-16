import { $ } from '@jeniex/utils/browser';
import { SetContentOpt } from '../types';

/**
 * Sets the content of match and common elements in the table.
 */
function setContent({ rowElement, match, common }: SetContentOpt): void {
  const matchElement = $('.icon-link', rowElement);
  matchElement.lastChild!.textContent = `${match}%`;

  const commonElement = $('.icon-common', rowElement);
  commonElement.lastChild!.textContent = common.toString();
}

export default setContent;
