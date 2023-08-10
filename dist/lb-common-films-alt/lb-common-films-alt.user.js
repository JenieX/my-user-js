// ==UserScript==
// @name           jx-letterboxd-common-films-alt
// @version        0.0.1
// @namespace      https://github.com/JenieX/user-js
// @description    Discover users on Letterboxd with similar movie tastes
// @author         JenieX
// @match          https://letterboxd.com/film/*/fans/*
// @match          https://letterboxd.com/film/*/likes/*
// @match          https://letterboxd.com/film/*/members/*
// @grant          GM.registerMenuCommand
// @grant          GM.setValue
// @grant          GM.getValue
// @require        https://unpkg.com/@popperjs/core@2.11.8/dist/umd/popper.min.js
// @require        https://unpkg.com/tippy.js@6.3.7/dist/tippy-bundle.umd.js
// @run-at         document-start
// @noframes
// @compatible     edge Violentmonkey
// @compatible     chrome Violentmonkey
// @supportURL     https://github.com/JenieX/user-js/issues
// @homepageURL    https://github.com/JenieX/user-js/tree/main/src/user-js/lb-common-films-alt
// @updateURL      https://github.com/JenieX/user-js/raw/main/dist/lb-common-films-alt/lb-common-films-alt.meta.js
// @downloadURL    https://github.com/JenieX/user-js/raw/main/dist/lb-common-films-alt/lb-common-films-alt.user.js
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

function createTooltip(options) {
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

async function getAccount() {
  const accountUsername = await GM.getValue('accountUsername');
  if (typeof accountUsername !== 'string') {
    throw new TypeError('Set your account username to activate the script');
  }

  return accountUsername;
}

let detectedElements;
let resolveGetElements;

function detectElements() {
  new MutationObserver((mutations, observer) => {
    for (const mutation of mutations) {
      const { target } = mutation;
      if (target instanceof HTMLElement && target.matches('nav.footer-nav.js-footer-nav')) {
        observer.disconnect();
        const avatarElements = document.querySelectorAll('table.person-table.film-table a.avatar');
        if (resolveGetElements === undefined) {
          detectedElements = avatarElements;
        } else {
          resolveGetElements(avatarElements);
        }

        return;
      }
    }
  }).observe(document, {
    childList: true,
    subtree: true,
  });
}

async function getElements() {
  return new Promise((resolve) => {
    if (detectedElements === undefined) {
      resolveGetElements = resolve;
    } else {
      resolve(detectedElements);
    }
  });
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

/** The identifier of the script to be used in logging */
const LOG_ID = `[${GM.info.script.name}]:`;

function alert(message) {
  if (message === undefined) {
    window.alert(`[ ${GM.info.script.name} ]`);

    return;
  }

  window.alert(`[ ${GM.info.script.name} ]\n\n${message}`);
}

function prompt(message, _default) {
  return window.prompt(`[ ${GM.info.script.name} ]\n\n${message}`, _default);
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

function extractFilmData(posterElement) {
  const title = $('img', posterElement).alt;
  const id = posterElement.firstElementChild.dataset.targetLink;
  // Next line could crash the scope
  const ratingElement = $('.rating', posterElement);
  const rating = Number(ratingElement.className.split('-').pop());

  return { title, id, rating };
}

async function getFilms({ link, collector, myFilmsIDs }) {
  // eslint-disable-next-line prefer-const
  let reachedTheEnd = false;
  const films = collector ?? [];
  const documentX = await fish.document(link);
  let container;

  try {
    container = $('.content-wrap ul.poster-list', documentX.body);
  } catch {
    return films;
  }

  const posterElements = $$('li[class="poster-container"]', container);

  for (const posterElement of posterElements) {
    try {
      const film = extractFilmData(posterElement);
      if (!myFilmsIDs.has(film.id)) {
        reachedTheEnd = true;
        break;
      }

      films.push(film);
    } catch {}
  }

  const nextPageElement = documentX.querySelector('.paginate-nextprev > a.next');
  if (nextPageElement === null || reachedTheEnd === true) {
    return films;
  }

  const nextPageLink = nextPageElement.href;

  return getFilms({ link: nextPageLink, collector: films, myFilmsIDs });
}

async function getMyFilms({ link, collector }) {
  let reachedTheEnd = false;
  const films = collector ?? [];
  const documentX = await fish.document(link);
  let container;

  try {
    container = $('.content-wrap ul.poster-list', documentX.body);
  } catch {
    return films;
  }

  const posterElements = $$('li[class="poster-container"]', container);

  for (const posterElement of posterElements) {
    let film;

    try {
      film = extractFilmData(posterElement);
    } catch {
      reachedTheEnd = true;
      break;
    }

    films.push(film);
  }

  const nextPageElement = documentX.querySelector('.paginate-nextprev > a.next');
  if (nextPageElement === null || reachedTheEnd === true) {
    return films;
  }

  const nextPageLink = nextPageElement.href;

  return getMyFilms({ link: nextPageLink, collector: films });
}

const loading = 'Loading..';
const isYou = 'This is you!';
const noCommonFilms = 'You have no common <strong>Rated</strong> films with this user';

const messages = {
  loading,
  isYou,
  noCommonFilms,
};

async function checkAccount(username) {
  try {
    await fish.text(`https://letterboxd.com/${username}/`);
  } catch {
    return false;
  }

  return true;
}

async function setAccount() {
  const username = prompt('Provide your account username, and make sure it is correct.');
  if (username === null || username === '') {
    alert('Invalid input');

    return;
  }

  const isValidAccount = await checkAccount(username);
  if (isValidAccount === false) {
    alert('Invalid account username');

    return;
  }

  await GM.setValue('accountUsername', username);
  alert('Account username was set successfully!\n\nThe script will be active on supported pages now.');
}

const { tippy } = window;
tippy.setDefaultProps({
  allowHTML: true,
  placement: 'right',
  maxWidth: 'none',
  content: messages.loading,
});

addStyle('.common-match>h3{color:#939393;font-size:medium;font-weight:bolder;text-align:center}.common-films{max-height:50vh;overflow:auto;width:max-content}.common-films>li{padding:7px}.common-films>:not(:last-child){border-bottom:1px solid #353535}.common-films>li.prefect-match>a{color:#15b3e9}.common-films>li.match>a{color:#8f6be2}.common-films>li.close>a{color:#35d274}.common-films>li.off>a{color:#dd8820}.common-films>li.way-off>a{color:#e94363}.person-summary.loading a.name{color:#d63f74}.person-summary.loaded a.name{color:#a2ff00}.common-films::-webkit-scrollbar{height:3px;width:3px}.common-films::-webkit-scrollbar-thumb{background:#353535}.tippy-box{background-color:#000}.tippy-arrow{color:#000}');
const isAndroid = window.navigator.userAgent.includes('Android');

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
  const accountUsername = await getAccount();
  const myFilmsLink = `https://letterboxd.com/${accountUsername}/films/by/entry-rating/`;
  const myFilms = await getMyFilms({ link: myFilmsLink });
  const myFilmsIDs = new Set(myFilms.map(({ id }) => id));
  const myRatedFilms = extractMyRatedFilms(myFilms);
  const avatarElements = await getElements();

  for (const avatarElement of avatarElements) {
    const userFilmsLink = `${avatarElement.href}films/by/your-rating/`;
    if (isAndroid) {
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

        avatarElement.parentElement.classList.add('loading');
        const commonFilms = await getFilms({ link: userFilmsLink, myFilmsIDs });
        commonFilms.sort((a, b) => b.rating - a.rating);
        if (commonFilms.length === 0) {
          instance.setContent(messages.noCommonFilms);
          avatarElement.parentElement.classList.add('loaded');

          return;
        }

        const commonFilmsText = createTooltip({
          commonFilms,
          myRatedFilms,
          userFilmsLink: userFilmsLink.replace('/your-', '/entry-'),
        });

        instance.setProps({ interactive: true });
        instance.setContent(commonFilmsText);
        avatarElement.parentElement.classList.add('loaded');
      },
    });
  }
}

detectElements();
main().catch((exception) => {
  console.error(LOG_ID, exception.message);
});
GM.registerMenuCommand('Set your account username', setAccount);
