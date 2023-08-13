import createItems from '../create-items';
import getIdentifier from '../get-identifier';
import { $ } from '../../../../helpers';

function rebuildContent(htmlContent: string): string {
  const tempElement = document.createElement('div');
  tempElement.innerHTML = htmlContent;

  try {
    // Cleanup
    const proElement = $<HTMLAnchorElement>('a[href="/pro/"]', tempElement);
    proElement.parentElement?.remove();

    $('.js-actions-panel > .panel-sharing').remove();
  } catch {}

  try {
    const filmID = getIdentifier();
    const extraElements = createItems(filmID);

    for (const extraElement of extraElements) {
      tempElement.append(extraElement);
    }
  } catch {}

  return tempElement.innerHTML;
}

export default rebuildContent;
