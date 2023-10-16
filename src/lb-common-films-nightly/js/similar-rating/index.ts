import { $, tabURL, pageLoad } from '@jeniex/utils/browser';
import createSimilarTooltip from './create-similar-tooltip';
import getSimilarFilms from './get-similar-films';
import { tippy } from '../libraries';
import { getFilms } from '../storage';

async function attachSimilarRatingTooltip(): Promise<void> {
  await pageLoad(true);
  // await sleep(2000);

  const element = $('.headline-1');
  element.style.setProperty('cursor', 'default');

  tippy(element, {
    placement: 'bottom',
    async onShow(instance) {
      const filmID = tabURL.split('/')[4];
      const myFilms = getFilms();

      const filmRating = myFilms[filmID!]?.[0];

      if (filmRating === undefined || filmRating === 0) {
        instance.setContent('Not rated');

        return;
      }

      // Remove self
      // myFilms[filmID!] = 0;

      const similarFilms = getSimilarFilms(filmRating, myFilms);

      if (similarFilms.length === 0) {
        instance.setContent('No similar films to this in rating');

        return;
      }

      const commonFilmsText = createSimilarTooltip(similarFilms, filmID!);

      instance.setProps({ interactive: true });
      instance.setContent(commonFilmsText);
    },
  });
}

// TODO disable on:
// https://letterboxd.com/film/stockholm/members/rated/5/by/popular/page/3/
if (tabURL.startsWith('https://letterboxd.com/film/')) {
  attachSimilarRatingTooltip().catch(() => {
    // console.error(exception);
  });
}
