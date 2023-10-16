import { $ } from '@jeniex/utils/browser';

function addHeaderCells(): void {
  const parentElement = $('.person-table > thead > tr');

  const matchElement = document.createElement('th');
  matchElement.textContent = 'Match';

  const commonElement = document.createElement('th');
  commonElement.textContent = 'Common';

  parentElement.insertBefore(matchElement, parentElement.lastElementChild);
  parentElement.insertBefore(commonElement, parentElement.lastElementChild);
}

export default addHeaderCells;
