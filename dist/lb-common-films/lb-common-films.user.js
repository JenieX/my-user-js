// ==UserScript==
// @name           jx-letterboxd-common-films
// @version        0.0.1
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

async function sleep(milliSeconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliSeconds);
  });
}

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
  const films = collector ?? [];
  const documentX = await fish.document(userFilmsLink);
  const container = $('.content-wrap ul.poster-list', documentX.body);
  const elements = $$('li[class="poster-container"]', container);

  for (const element of elements) {
    const film = {
      title: $('img', element).alt,
      id: element.firstElementChild.dataset.filmId,
    };

    try {
      const ratingElement = $('.rating', element);
      const rating = ratingElement.className.split('-').pop();
      film.rating = Number(rating);
    } catch {}

    films.push(film);
  }

  const nextPageElement = documentX.querySelector('.paginate-nextprev > a.next');
  if (nextPageElement === null) {
    return films;
  }

  await sleep(500);
  const nextPageLink = nextPageElement.href;

  return getUserFilms(nextPageLink, films);
}

const { tippy } = window;

async function main() {
  await waitForCompleteLoad();
  const state = { busy: false };
  const myFilmsLink = getMyFilmsLink();
  const myFilms = await getUserFilms(myFilmsLink);
  const myFilmsIDs = new Set(myFilms.map(({ id }) => id));
  const elements = $$('table.person-table.film-table a.avatar');

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
          commonFilmsText += `<li>${title} (${rating / 2})</li>`;
        }

        commonFilmsText += '</ul>';
        instance.setContent(commonFilmsText);
        state.busy = false;
      },
    });
  }
}

main().catch((exception) => {
  console.error(exception.message);
});
