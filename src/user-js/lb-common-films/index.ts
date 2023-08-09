import createTooltipContent from './js/create-tooltip-content';
import getMyFilmsLink from './js/get-my-films-link';
import getUserFilms from './js/get-user-films';
import messages from './js/messages';
import tippy from './js/tippy';
import { $$, addStyle, waitForCompleteLoad } from '../../helpers';
import { Film, MyRatedFilms } from './js/types';

addStyle('include-file: style.min.css');

function extractMyRatedFilms(myFilms: Film[]): MyRatedFilms {
  const map: MyRatedFilms = {};

  for (const { id, rating } of myFilms) {
    if (rating !== undefined) {
      map[id] = rating;
    }
  }

  return map;
}

async function main(): Promise<void> {
  await waitForCompleteLoad();
  const state = { busy: false };

  const myFilmsLink = getMyFilmsLink();
  const myFilms = await getUserFilms(myFilmsLink);
  const myFilmsIDs = new Set(myFilms.map(({ id }) => id));
  const myRatedFilms = extractMyRatedFilms(myFilms);

  const avatarElements = $$<HTMLAnchorElement>('table.person-table.film-table a.avatar');

  for (const avatarElement of avatarElements) {
    const userFilmsLink = `${avatarElement.href}films/by/entry-rating/`;
    avatarElement.removeAttribute('href');

    tippy(avatarElement, {
      async onShow(instance) {
        if (instance.loaded) {
          return;
        }

        if (state.busy) {
          instance.setContent(messages.wait);

          return;
        }

        // eslint-disable-next-line no-param-reassign
        instance.loaded = true;
        state.busy = true;

        if (userFilmsLink.startsWith(myFilmsLink)) {
          instance.setContent(messages.isYou);
          state.busy = false;

          return;
        }

        avatarElement.parentElement!.classList.add('loading');
        const userFilms = await getUserFilms(userFilmsLink);
        const commonFilms = userFilms.filter(({ id }) => myFilmsIDs.has(id));

        if (commonFilms.length === 0) {
          instance.setContent(messages.noCommonFilms);
          state.busy = false;
          avatarElement.parentElement!.classList.add('loaded');

          return;
        }

        const commonFilmsText = createTooltipContent({ commonFilms, myRatedFilms, userFilmsLink });

        instance.setProps({ interactive: true });
        instance.setContent(commonFilmsText);
        state.busy = false;
        avatarElement.parentElement!.classList.add('loaded');
      },

      onHidden(instance) {
        if (instance.loaded !== true) {
          instance.setContent(messages.loading);
        }
      },
    });
  }
}

main().catch((exception: Error) => {
  console.error(exception.message);
});
