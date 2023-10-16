import { $$ } from '@jeniex/utils/browser';
import createBodyCell from './create-body-cell';

function addBodyCells(): void {
  const rowElements = $$('.person-table > tbody > tr');

  for (const element of rowElements) {
    const matchElement = createBodyCell('icon-link');
    const commonElement = createBodyCell('icon-common');

    element.insertBefore(matchElement, element.lastElementChild);
    element.insertBefore(commonElement, element.lastElementChild);
  }
}

export default addBodyCells;
