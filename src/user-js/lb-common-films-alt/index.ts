import createTooltip from './js/create-tooltip';
import getAccount from './js/get-account';
import getElements, { detectElements } from './js/get-elements';
import getFilms from './js/get-films';
import getMyFilms from './js/get-my-films';
import messages from './js/messages';
import setAccount from './js/set-account';
import tippy from './js/tippy';
import { Film, MyRatedFilms } from './js/types';
import { LOG_ID, addStyle } from '../../helpers';

const IS_ANDROID = window.navigator.userAgent.includes('Android');

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
  const accountUsername = await getAccount();
  const myFilmsLink = `https://letterboxd.com/${accountUsername}/films/by/entry-rating/`;

  const myFilms = await getMyFilms({ link: myFilmsLink });
  const myFilmsIDs = new Set(myFilms.map(({ id }) => id));
  const myRatedFilms = extractMyRatedFilms(myFilms);

  const avatarElements = await getElements();

  for (const avatarElement of avatarElements) {
    const userFilmsLink = `${avatarElement.href}films/by/your-rating/`;
    if (IS_ANDROID) {
      avatarElement.removeAttribute('href');
    }

    tippy(avatarElement, {
      async onShow(instance) {
        if (instance.loaded) {
          return;
        }

        // eslint-disable-next-line no-param-reassign
        instance.loaded = true;

        if (userFilmsLink.startsWith(myFilmsLink.slice(0, -13))) {
          instance.setContent(messages.isYou);

          return;
        }

        avatarElement.parentElement!.classList.add('loading');

        const commonFilms = await getFilms({ link: userFilmsLink, myFilmsIDs });
        commonFilms.sort((a, b) => b.rating! - a.rating!);

        const totalFilms = commonFilms.totalFilms!;

        if (commonFilms.length === 0) {
          instance.setContent(messages.noCommonFilms);
          avatarElement.parentElement!.classList.add('loaded');

          return;
        }

        const commonFilmsText = createTooltip({
          commonFilms,
          myRatedFilms,
          userFilmsLink: userFilmsLink.replace('/your-', '/entry-'),
          totalFilms,
        });

        instance.setProps({ interactive: true });
        instance.setContent(commonFilmsText);
        avatarElement.parentElement!.classList.add('loaded');
      },
    });
  }
}

detectElements();

main().catch((exception: Error) => {
  console.error(LOG_ID, exception.message);
});

GM.registerMenuCommand('Set your account username', setAccount);
