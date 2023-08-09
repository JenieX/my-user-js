// ==UserScript==
// @name           jx-letterboxd-common-films
// @version        0.0.3
// @namespace      https://github.com/JenieX/user-js
// @description    Find users that may share similar taste in movies at Letterboxd quicker
// @author         JenieX
// @match          https://letterboxd.com/film/*/fans/*
// @match          https://letterboxd.com/film/*/likes/*
// @match          https://letterboxd.com/film/*/members/*
// @require        https://unpkg.com/@popperjs/core@2.11.8/dist/umd/popper.min.js
// @require        https://unpkg.com/tippy.js@6.3.7/dist/tippy-bundle.umd.js
// @run-at         document-start
// @noframes
// @compatible     edge Violentmonkey
// @compatible     chrome Violentmonkey
// @supportURL     https://github.com/JenieX/user-js/issues
// @homepageURL    https://github.com/JenieX/user-js/tree/main/src/user-js/lb-common-films
// @updateURL      https://github.com/JenieX/user-js/raw/main/dist/lb-common-films/lb-common-films.meta.js
// @downloadURL    https://github.com/JenieX/user-js/raw/main/dist/lb-common-films/lb-common-films.user.js
// @icon           https://www.google.com/s2/favicons?sz=64&domain=letterboxd.com
// @license        MIT
// ==/UserScript==

function createTooltipContent(commonFilms) {
  let commonFilmsText = '<ul class="common-films">';

  for (const { title, rating } of commonFilms) {
    commonFilmsText += `<li>${title} (${rating / 2})</li>`;
  }

  commonFilmsText += '</ul>';

  return commonFilmsText;
}

function $(selector, parent) {
  const element = (parent ?? document).querySelector(selector);
  if (element === null) {
    throw new Error(`Couldn't find the element with the selector ${selector}`);
  }

  return element;
}

function $$(selector, parent) {
  const elements = (parent ?? document).querySelectorAll(selector);
  if (elements.length === 0) {
    throw new Error(`Couldn't find any element with the selector ${selector}`);
  }

  return elements;
}

function addStyle(css, parent = document.documentElement) {
  const style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.textContent = css;
  parent.append(style);

  return style;
}

async function fishResponse(url, fishOptions) {
  let response;
  let abortTimeOut;
  if (fishOptions.timeOut === undefined || fishOptions.signal !== undefined) {
    response = await fetch(url, fishOptions);
  } else {
    const controller = new AbortController();
    const { signal } = controller;
    abortTimeOut = setTimeout(() => { controller.abort(); }, fishOptions.timeOut);
    response = await fetch(url, { signal, ...fishOptions });
  }

  if (!response.ok) {
    throw new Error(`Request to ${response.url} ended with ${response.status} status`);
  }

  return { response, abortTimeOut };
}

const fish = {
  async buffer(url, fishOptions = {}) {
    const { response, abortTimeOut } = await fishResponse(url, fishOptions);
    const responseBuffer = await response.arrayBuffer();
    if (abortTimeOut !== undefined) {
      clearTimeout(abortTimeOut);
    }

    return responseBuffer;
  },
  async blob(url, fishOptions = {}) {
    const { response, abortTimeOut } = await fishResponse(url, fishOptions);
    const responseBlob = await response.blob();
    if (abortTimeOut !== undefined) {
      clearTimeout(abortTimeOut);
    }

    return responseBlob;
  },
  async json(url, fishOptions = {}) {
    const { response, abortTimeOut } = await fishResponse(url, fishOptions);
    const responseJSON = await response.json();
    if (abortTimeOut !== undefined) {
      clearTimeout(abortTimeOut);
    }

    return responseJSON;
  },
  async text(url, fishOptions = {}) {
    const { response, abortTimeOut } = await fishResponse(url, fishOptions);
    const responseText = await response.text();
    if (abortTimeOut !== undefined) {
      clearTimeout(abortTimeOut);
    }

    return responseText;
  },
  async document(url, fishOptions = {}) {
    // const response = await fishResponse(url, fishOptions);
    const { response, abortTimeOut } = await fishResponse(url, fishOptions);
    const responseText = await response.text();
    if (abortTimeOut !== undefined) {
      clearTimeout(abortTimeOut);
    }

    const parser = new DOMParser();

    return parser.parseFromString(responseText, 'text/html');
  },
};

async function waitForCompleteLoad() {
  if (document.readyState === 'complete') {
    return;
  }

  // eslint-disable-next-line consistent-return
  return new Promise((resolve) => {
    window.addEventListener('load', () => {
      resolve();
    });
  });
}

function getMyFilmsLink() {
  return $('.main-nav .subnav a[href$="/films/"]').href;
}

async function getUserFilms(userFilmsLink, collector) {
  const onlyRatedFilms = userFilmsLink.includes('by/entry-rating');
  let reachedTheEndOfRatedFilms = false;
  const films = collector ?? [];
  const documentX = await fish.document(userFilmsLink);
  let container;

  try {
    container = $('.content-wrap ul.poster-list', documentX.body);
  } catch {
    return films;
  }

  const posterElements = $$('li[class="poster-container"]', container);

  for (const posterElement of posterElements) {
    const film = {
      title: $('img', posterElement).alt,
      id: posterElement.firstElementChild.dataset.filmId,
    };

    try {
      const ratingElement = $('.rating', posterElement);
      const rating = ratingElement.className.split('-').pop();
      film.rating = Number(rating);
    } catch {
      if (onlyRatedFilms === true) {
        reachedTheEndOfRatedFilms = true;
        break;
      }
    }

    films.push(film);
  }

  const nextPageElement = documentX.querySelector('.paginate-nextprev > a.next');
  if (nextPageElement === null || reachedTheEndOfRatedFilms === true) {
    return films;
  }

  const nextPageLink = nextPageElement.href;

  return getUserFilms(nextPageLink, films);
}

const loading = 'Loading..';
const isYou = 'This is you!';
const wait = 'Wait for previous action to complete..';
const noCommonFilms = 'You have no common <strong>Rated</strong> films with this user';

const messages = {
  loading,
  isYou,
  wait,
  noCommonFilms,
};

const { tippy } = window;
tippy.setDefaultProps({
  allowHTML: true,
  placement: 'right',
  // maxWidth: 300,
  content: messages.loading,
});

addStyle('.common-films{max-height:50vh;overflow:auto}.common-films>li{padding:5px}.common-films>li.prefect-match{color:#00bfff}.common-films>li.match{color:#8a2be2}.common-films>li.close{color:#32cd32}.common-films>li.off{color:#ff8c00}.common-films>li.way-off{color:crimson}.common-films>li.not-rated{color:gray}.common-films::-webkit-scrollbar{height:3px;width:3px}.common-films::-webkit-scrollbar-thumb{background:#5f5f5f}');

async function main() {
  await waitForCompleteLoad();
  const state = { busy: false };
  const myFilmsLink = getMyFilmsLink();
  const myFilms = await getUserFilms(myFilmsLink);
  const myFilmsIDs = new Set(myFilms.map(({ id }) => id));
  const avatarElements = $$('table.person-table.film-table a.avatar');

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

main().catch((exception) => {
  console.error(exception.message);
});
