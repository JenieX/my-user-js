import { alert, tabURL } from '@jeniex/utils/browser';
import createTooltip from './create-tooltip';
import evaluateFilms from './evaluate-films';
import messages from './messages';
import state from './state';
import { Films, TippyInstance, EvalFilter } from './types';
import { MY_ACCOUNT, IS_ANDROID } from './constants';
import { fetchFilms, fetchWatchlistFilms } from './fetch-films';
import { getCommonFilms, setCommonFilms } from './storage';
import { setContent } from './modify-table';
import { tippy } from './libraries';

async function prepareTooltip(instance: TippyInstance, filter?: EvalFilter): Promise<void> {
  state.lasRunFilter = filter;
  const element = instance.reference as HTMLAnchorElement;

  let user: string;

  if (element.matches('#avatar-zoom')) {
    user = tabURL.split('/')[3]!;
  } else {
    user = element.getAttribute('href')!.slice(1, -1);
  }

  if (IS_ANDROID) {
    element.removeAttribute('href');
  }

  if (user === MY_ACCOUNT) {
    instance.setContent(messages.isYou);

    return;
  }

  let commonFilms: Films;

  const storedCommonFilms = getCommonFilms(user);

  if (storedCommonFilms === undefined) {
    commonFilms = await fetchFilms({
      link: `https://letterboxd.com/${user}/films/`,
    });

    if (commonFilms.length > 0) {
      const watchlistedFilms = await fetchWatchlistFilms({
        link: `https://letterboxd.com/${user}/films/by/entry-rating/`,
      });

      commonFilms.push(...watchlistedFilms);
      commonFilms.sort((a, b) => b.rating! - a.rating!);
    }

    setCommonFilms(user, commonFilms);
  } else {
    commonFilms = storedCommonFilms;
  }

  if (commonFilms.length === 0) {
    instance.setContent(messages.noCommonFilms);

    return;
  }

  const totalFilms = commonFilms.totalFilms!.slice(0, -6);

  // console.log(commonFilms);

  const evaluatedFilms = evaluateFilms({
    commonFilms,
    sortByName: instance.options.sort === 'film-name',
    filter,
  });

  // console.log(evaluatedFilms);

  const commonFilmsLength = evaluatedFilms.filter(({ myRating }) => {
    return /* label === 'watchlisted' && */ myRating !== undefined;
  }).length;

  const commonFilmsText = createTooltip({
    evaluatedFilms,
    user,
    totalFilms: `${commonFilmsLength} / ${totalFilms}`,
  });

  instance.setProps({ interactive: true });
  instance.setContent(commonFilmsText);

  // eslint-disable-next-line no-param-reassign
  instance.busy = false;
  state.tippyInstances[instance.popper.id] = instance;

  const rowElement = element.closest('tr');
  if (rowElement !== null) {
    setContent({
      rowElement,
      match: evaluatedFilms.match,
      common: evaluatedFilms.common,
    });
  }
}

async function attachTooltip(element: HTMLAnchorElement): Promise<void> {
  tippy(element, {
    async onShow(instance) {
      if (instance.options === undefined) {
        // eslint-disable-next-line no-param-reassign
        instance.options = {};
      }

      if (instance.busy === true) {
        console.log('Loading in progress..');

        return;
      }

      // eslint-disable-next-line no-param-reassign
      instance.busy = true;

      prepareTooltip(instance).catch((exception) => {
        alert((exception as Error).message);
      });
    },

    onHidden(instance: TippyInstance) {
      if (instance.options !== undefined && instance.options.sort === 'film-name') {
        // eslint-disable-next-line no-param-reassign
        instance.options.sort = 'user-rating';
      }
    },
  });
}

export {
  prepareTooltip,
};

export default attachTooltip;
