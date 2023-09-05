import { $ } from '@jeniex/utils/browser';
import { TooltipElements } from './types';

function createContainer(): TooltipElements {
  const container = document.createElement('div');
  container.innerHTML = 'include-file: container.html';
  container.setAttribute('id', 'common-films');

  return {
    container,
    matchElement: $('#common-films-match', container),
    totalElement: $('#common-films-total', container),
    listElement: $('#common-films-list', container),
  };
}

export default createContainer;
