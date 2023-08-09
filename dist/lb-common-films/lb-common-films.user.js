// ==UserScript==
// @name           jx-letterboxd-common-films
// @version        0.1.2
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

function getFilmClassName(myRating, userRating) {
  const average = (myRating + userRating) / 2;
  const difference = Math.abs(userRating - average);
  let className;

  switch (true) {
    case (difference === 0): {
      className = 'prefect-match';
      break;
    }

    case (difference === 0.5): {
      className = 'match';
      break;
    }

    case (difference === 1 || difference === 1.5): {
      className = 'close';
      break;
    }

    case (difference >= 2 && difference <= 3): {
      className = 'off';
      break;
    }

    default: {
      className = 'way-off';
      break;
    }
  }

  return className;
}

const filmClassNames = ['way-off', 'off', 'close', 'match', 'prefect-match'];

function createTooltipContent(options) {
  const { commonFilms, myRatedFilms, userFilmsLink } = options;
  let perfectPoints = 0;
  let userPoints = 0;
  let commonFilmsText = '<ul class="common-films">';

  for (const { title, rating: userRating, id } of commonFilms) {
    const myRating = myRatedFilms[id];
    if (myRating === undefined) {
      commonFilmsText += '<li class="not-rated">';
    } else {
      perfectPoints += 4;
      const filmClassName = getFilmClassName(userRating, myRating);
      userPoints += filmClassNames.indexOf(filmClassName);
      commonFilmsText += `<li class="${filmClassName}" title="Your rating: ${myRating / 2}">`;
    }

    commonFilmsText += `<a href="${id}" target="_blank">${title} (${userRating / 2})</a>`;
    commonFilmsText += '</li>';
  }

  commonFilmsText += '</ul>';
  const similarly = Math.floor((userPoints / perfectPoints) * 100);
  let matchElement = `<a class="common-match" href="${userFilmsLink}" target="_blank">`;
  matchElement += `<h3>Match: ${similarly}%</h3>`;
  matchElement += '</a>';

  return matchElement + commonFilmsText;
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
  const selectors = [
    '.main-nav .subnav a[href$="/films/"]',
    '#mobile-nav .subnav a[href$="/films/"]',
  ];

  return $(selectors.join(',')).href;
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
      id: posterElement.firstElementChild.dataset.targetLink,
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

addStyle('.common-match>h3{color:#ddd;font-size:small;font-weight:bolder;text-align:center}.common-films{max-height:50vh;overflow:auto}.common-films>li{padding:7px}.common-films>:not(:last-child){border-bottom:1px solid #666}.common-films>li.prefect-match>a{color:#11ace0}.common-films>li.match>a{color:#7184e7}.common-films>li.close>a{color:#3dbd70}.common-films>li.off>a{color:#c07923}.common-films>li.way-off>a{color:#c02a47}.common-films>li.not-rated>a{color:#c6c6c6}.common-films::-webkit-scrollbar{height:3px;width:3px}.person-summary.loading a.name{color:#d63f74}.person-summary.loaded a.name{color:#a2ff00}.common-films::-webkit-scrollbar-thumb{background:#5f5f5f}');

function extractMyRatedFilms(myFilms) {
  const map = {};

  for (const { id, rating } of myFilms) {
    if (rating !== undefined) {
      map[id] = rating;
    }
  }

  return map;
}

async function main() {
  await waitForCompleteLoad();
  const state = { busy: false };
  const myFilmsLink = getMyFilmsLink();
  const myFilms = await getUserFilms(myFilmsLink);
  const myFilmsIDs = new Set(myFilms.map(({ id }) => id));
  const myRatedFilms = extractMyRatedFilms(myFilms);
  const avatarElements = $$('table.person-table.film-table a.avatar');

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

        avatarElement.parentElement.classList.add('loading');
        const userFilms = await getUserFilms(userFilmsLink);
        const commonFilms = userFilms.filter(({ id }) => myFilmsIDs.has(id));
        if (commonFilms.length === 0) {
          instance.setContent(messages.noCommonFilms);
          state.busy = false;
          avatarElement.parentElement.classList.add('loaded');

          return;
        }

        const commonFilmsText = createTooltipContent({ commonFilms, myRatedFilms, userFilmsLink });
        instance.setProps({ interactive: true });
        instance.setContent(commonFilmsText);
        state.busy = false;
        avatarElement.parentElement.classList.add('loaded');
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
