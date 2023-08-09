import { Film } from './types';

function createTooltipContent(commonFilms: Film[]): string {
  let commonFilmsText = '<ul class="common-films">';

  for (const { title, rating } of commonFilms) {
    commonFilmsText += `<li>${title} (${rating! / 2})</li>`;
  }

  commonFilmsText += '</ul>';

  return commonFilmsText;
}

export default createTooltipContent;
