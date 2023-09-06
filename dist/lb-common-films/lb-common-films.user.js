// ==UserScript==
// @name           jx-letterboxd-common-films
// @version        0.1.4
// @namespace      https://github.com/JenieX/user-js
// @description    Discover users on Letterboxd with similar movie tastes
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
// @homepageURL    https://github.com/JenieX/user-js/tree/main/src/lb-common-films
// @updateURL      https://github.com/JenieX/user-js/raw/main/dist/lb-common-films/lb-common-films.meta.js
// @downloadURL    https://github.com/JenieX/user-js/raw/main/dist/lb-common-films/lb-common-films.user.js
// @icon           https://www.google.com/s2/favicons?sz=64&domain=letterboxd.com
// @license        MIT
// ==/UserScript==

function isString(object) {
  return typeof object === 'string';
}

function ensureJoin(object, separator = ',') {
  if (isString(object)) {
    return object;
  }

  return object.join(separator);
}

let infoObject;
if (typeof GM !== 'undefined') {
  infoObject = GM.info;
  // eslint-disable-next-line unicorn/no-negated-condition
} else if (typeof GM_info === 'undefined') {
  infoObject = { script: { name: document.title } };
} else {
  infoObject = GM_info;
}

const scriptName = infoObject.script.name;
/** The identifier of the script to be used in logging. */
const logId = `[${scriptName}]:`;

async function fishResponse(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Request to ${response.url} ended with ${response.status} status.`);
  }

  return response;
}

// Note: to set the 'cookie' header, you have to set 'anonymous' to true.
async function fishXResponse(url, fishOptions) {
  const { method, anonymous, headers, body, timeOut, onProgress } = fishOptions ?? {};

  return new Promise((resolve, reject) => {
    GM.xmlHttpRequest({
      url,
      method: method ?? 'GET',
      headers,
      anonymous,
      data: body,
      responseType: 'blob',
      timeout: timeOut,
      onprogress: onProgress,
      onload({ response, statusText, status, finalUrl }) {
        const ok = status >= 200 && status < 300;
        if (!ok) {
          reject(new Error(`Request to ${url} ended with ${status} status.`));

          return;
        }

        const properResponse = new Response(response, {
          statusText,
          status,
        });

        Object.defineProperty(properResponse, 'url', { value: finalUrl });
        resolve(properResponse);
      },
      onerror({ status }) {
        reject(new Error(`Request to ${url} ended with ${status} status.`));
      },
    });
  });
}

async function fishBlob(url, options, x) {
  const response = await (x ? fishXResponse : fishResponse)(url, options);

  return response.blob();
}

async function fishBuffer(url, options, x) {
  const response = await (x ? fishXResponse : fishResponse)(url, options);

  return response.arrayBuffer();
}

async function fishDocument(url, options, x) {
  const response = await (x ? fishXResponse : fishResponse)(url, options);
  const responseText = await response.text();
  const parser = new DOMParser();

  return parser.parseFromString(responseText, 'text/html');
}

async function fishJSON(url, options, x) {
  const response = await (x ? fishXResponse : fishResponse)(url, options);

  return response.json();
}

async function fishText(url, options, x) {
  const response = await (x ? fishXResponse : fishResponse)(url, options);

  return response.text();
}

// https://httpbin.org/anything
const fish = {
  blob: async (url, options) => fishBlob(url, options),
  buffer: async (url, options) => fishBuffer(url, options),
  document: async (url, options) => fishDocument(url, options),
  JSON: async (url, options) => fishJSON(url, options),
  text: async (url, options) => fishText(url, options),
};

function $(selectors, parent) {
  const element = (parent ?? document).querySelector(ensureJoin(selectors));
  if (element === null) {
    throw new Error(`Couldn't find the element with the selector ${selectors}`);
  }

  return element;
}

function $$(selectors, parent) {
  const elements = (parent ?? document).querySelectorAll(ensureJoin(selectors));
  if (elements.length === 0) {
    throw new Error(`Couldn't find any element with the selector ${selectors}`);
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

/**
 * Waits for the page to load.
 * @param completely Whether or not to wait for resources to load as well.
 */
async function pageLoad(completely) {
  return new Promise((resolve) => {
    if (document.readyState === 'complete') {
      resolve();

      return;
    }

    if (completely === true) {
      window.addEventListener('load', () => resolve());

      return;
    }

    document.addEventListener('DOMContentLoaded', () => resolve());
  });
}

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
  let similarly = 0;
  if (perfectPoints !== 0) {
    similarly = Math.floor((userPoints / perfectPoints) * 100);
  }

  let matchElement = `<a class="common-match" href="${userFilmsLink}" target="_blank">`;
  matchElement += `<h3>Match: ${similarly}%</h3>`;
  matchElement += '</a>';

  return matchElement + commonFilmsText;
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
  maxWidth: 'none',
  content: messages.loading,
});

addStyle('.common-match>h3{color:#ddd;font-size:small;font-weight:bolder;text-align:center}.common-films{max-height:50vh;overflow:auto;width:max-content}.common-films>li{padding:7px}.common-films>:not(:last-child){border-bottom:1px solid #666}.common-films>li.prefect-match>a{color:#11ace0}.common-films>li.match>a{color:#7184e7}.common-films>li.close>a{color:#3dbd70}.common-films>li.off>a{color:#c07923}.common-films>li.way-off>a{color:#c02a47}.common-films>li.not-rated>a{color:#c6c6c6}.common-films::-webkit-scrollbar{height:3px;width:3px}.person-summary.loading a.name{color:#d63f74}.person-summary.loaded a.name{color:#a2ff00}.common-films::-webkit-scrollbar-thumb{background:#5f5f5f}');

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
  await pageLoad();
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
  console.error(logId, exception.message);
});
