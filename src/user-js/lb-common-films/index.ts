import createTooltipContent from './js/create-tooltip-content';
import getMyFilmsLink from './js/get-my-films-link';
import getUserFilms from './js/get-user-films';
import messages from './js/messages';
import tippy from './js/tippy';
import { $$, addStyle, waitForCompleteLoad } from '../../helpers';

addStyle('include-file: style.min.css');

async function main(): Promise<void> {
  await waitForCompleteLoad();
  const state = { busy: false };

  const myFilmsLink = getMyFilmsLink();
  const myFilms = await getUserFilms(myFilmsLink);
  const myFilmsIDs = new Set(myFilms.map(({ id }) => id));

  const avatarElements = $$<HTMLAnchorElement>('table.person-table.film-table a.avatar');

  for (const avatarElement of avatarElements) {
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

        const userFilmsLink = `${avatarElement.href}films/by/entry-rating/`;
        if (userFilmsLink.startsWith(myFilmsLink)) {
          instance.setContent(messages.isYou);
          state.busy = false;

          return;
        }

        const userFilms = await getUserFilms(userFilmsLink);
        const commonFilms = userFilms.filter(({ id }) => myFilmsIDs.has(id));

        if (commonFilms.length === 0) {
          instance.setContent(messages.noCommonFilms);
          state.busy = false;

          return;
        }

        const commonFilmsText = createTooltipContent(commonFilms);

        instance.setProps({ interactive: true });
        instance.setContent(commonFilmsText);
        state.busy = false;
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
