import getMyFilmsLink from './js/get-my-films-link';
import getUserFilms from './js/get-user-films';
import { $$, waitForCompleteLoad } from '../../helpers';
import { ScriptWindow } from './js/types';

const { tippy } = (window as unknown) as ScriptWindow;

async function main(): Promise<void> {
  await waitForCompleteLoad();
  const state = { busy: false };

  const myFilmsLink = getMyFilmsLink();

  const myFilms = await getUserFilms(myFilmsLink);
  const myFilmsIDs = new Set(myFilms.map(({ id }) => id));

  const elements = $$<HTMLAnchorElement>('table.person-table.film-table a.avatar');

  for (const element of elements) {
    tippy(element, {
      allowHTML: true,
      content: 'Loading..',

      async onShow(instance) {
        if (instance.loaded) {
          return;
        }

        if (state.busy) {
          instance.setContent('Wait for previous action to complete..');

          return;
        }

        // eslint-disable-next-line no-param-reassign
        instance.loaded = true;
        state.busy = true;

        const userFilmsLink = `${element.href}films/`;
        if (myFilmsLink === userFilmsLink) {
          instance.setContent('This is you!');
          state.busy = false;

          return;
        }

        const userFilms = await getUserFilms(userFilmsLink);

        const commonFilms = userFilms.filter(({ id, rating }) => {
          return myFilmsIDs.has(id) && rating !== undefined;
        });

        if (commonFilms.length === 0) {
          instance.setContent('You have no common films with this user');
          state.busy = false;

          return;
        }

        let commonFilmsText = '<ul>';

        for (const { title, rating } of commonFilms) {
          commonFilmsText += `<li>${title} (${rating! / 2})</li>`;
        }

        commonFilmsText += '</ul>';

        instance.setContent(commonFilmsText);
        state.busy = false;
      },
    });
  }
}

main().catch((exception: Error) => {
  console.error(exception.message);
});
