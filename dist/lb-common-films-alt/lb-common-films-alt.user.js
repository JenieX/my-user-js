// ==UserScript==
// @name           jx-letterboxd-common-films-alt
// @version        0.0.2
// @namespace      https://github.com/JenieX/user-js
// @description    Discover users on Letterboxd with similar movie tastes
// @author         JenieX
// @match          https://letterboxd.com/*/films/*
// @match          https://letterboxd.com/*/followers/*
// @match          https://letterboxd.com/*/following/*
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
const IS_ANDROID = window.navigator.userAgent.includes('Android');

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

function createContainer() {
  const container = document.createElement('div');
  container.innerHTML = '<header> <a id="common-films-match" target="_blank"> <h3>Match: 0%</h3> </a> <h5 id="common-films-total" title="User films"></h5> </header><article> <ul id="common-films-list"></ul> </article>';
  container.setAttribute('id', 'common-films');

  return {
    container,
    matchElement: $('#common-films-match', container),
    totalElement: $('#common-films-total', container),
    listElement: $('#common-films-list', container),
  };
}

const filmClasses = ['way-off', 'off', 'close', 'match', 'great-match'];

function getFilmClass(myRating, userRating) {
  const average = (myRating + userRating) / 2;
  const difference = Math.abs(userRating - average) * 2;
  let className;

  switch (true) {
    case (difference <= 1): {
      className = filmClasses[4];
      break;
    }

    case (difference <= 3): {
      className = filmClasses[3];
      break;
    }

    case (difference <= 5): {
      className = filmClasses[2];
      break;
    }

    case (difference <= 7): {
      className = filmClasses[1];
      break;
    }

    default: {
      className = filmClasses[0];
      break;
    }
  }

  return className;
}

function createTooltip(options) {
  const { commonFilms, myRatedFilms, userFilmsLink, totalFilms } = options;
  let perfectPoints = 0;
  let userPoints = 0;
  const { container, listElement, matchElement, totalElement } = createContainer();

  for (const { title, rating: userRating, id } of commonFilms) {
    const listItem = document.createElement('li');
    const myRating = myRatedFilms[id];
    if (myRating !== undefined) {
      perfectPoints += 4;
      const filmClassName = getFilmClass(userRating, myRating);
      userPoints += filmClasses.indexOf(filmClassName);
      listItem.setAttribute('class', filmClassName);
      listItem.setAttribute('title', `Your rating: ${myRating / 2}`);
    }

    listItem.innerHTML = `<a href="${id}" target="_blank">${title} (${userRating / 2})</a>`;
    listElement.append(listItem);
  }

  matchElement.setAttribute('href', userFilmsLink);
  if (perfectPoints !== 0) {
    const similarly = Math.floor((userPoints / perfectPoints) * 100);
    matchElement.firstElementChild.textContent = `Match: ${similarly}%`;
  }

  totalElement.textContent = totalFilms;

  return container.outerHTML;
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

        const avatarSelectors = [
          'table.person-table a.avatar',
          '.profile-mini-person > .avatar',
        ];

        const avatarElements = document.querySelectorAll(avatarSelectors.join(','));
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

function extractFilmData(posterElement) {
  const title = $('img', posterElement).alt;
  const id = posterElement.firstElementChild.dataset.targetLink;

  try {
    const ratingElement = $('.rating', posterElement);
    const rating = Number(ratingElement.className.split('-').pop());

    return { title, id, rating };
  } catch {
    throw new Error(id);
  }
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
    } catch (exception) {
      const id = exception.message;
      if (!myFilmsIDs.has(id)) {
        reachedTheEnd = true;
        break;
      }
    }
  }

  const nextPageElement = documentX.querySelector('.paginate-nextprev > a.next');
  if (nextPageElement === null || reachedTheEnd === true) {
    const totalElement = $('.sub-nav > .selected > a', documentX.body);
    const totalFilms = totalElement.title;
    films.totalFilms = totalFilms;

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
      // const firstNotRatedFilm = (exception as Error).message;
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

addStyle('#common-films>header{cursor:default;margin-bottom:10px}#common-films-match>h3{color:#939393;font-size:medium;font-weight:bolder;text-align:center}#common-films-total{color:#535353;text-align:center}#common-films-list{max-height:50vh;overflow:auto;width:max-content}#common-films-list>li{padding:7px}#common-films-list>:not(:last-child){border-bottom:1px solid #353535}#common-films-list>li.great-match>a{color:#15b3e9}#common-films-list>li.match>a{color:#8f6be2}#common-films-list>li.close>a{color:#35d274}#common-films-list>li.off>a{color:#dd8820}#common-films-list>li.way-off>a{color:#e94363}.person-summary.loading a.name{color:#d63f74}.person-summary.loaded a.name{color:#a2ff00}#common-films-list::-webkit-scrollbar{height:3px;width:3px}#common-films-list::-webkit-scrollbar-thumb{background:#353535}.tippy-box{background-color:#000}.tippy-arrow{color:#000}');

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

        avatarElement.parentElement.classList.add('loading');
        const commonFilms = await getFilms({ link: userFilmsLink, myFilmsIDs });
        commonFilms.sort((a, b) => b.rating - a.rating);
        const { totalFilms } = commonFilms;
        if (commonFilms.length === 0) {
          instance.setContent(messages.noCommonFilms);
          avatarElement.parentElement.classList.add('loaded');

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
