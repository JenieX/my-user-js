// ==UserScript==
// @name           jx-letterboxd-actors-avatars
// @version        0.0.2
// @namespace      https://github.com/JenieX/user-js
// @description    Adds avatars to the list of actors in films pages.
// @author         JenieX
// @match          https://letterboxd.com/film/*/
// @excludeMatch   https://letterboxd.com/film/*/fans/*
// @excludeMatch   https://letterboxd.com/film/*/likes/*
// @excludeMatch   https://letterboxd.com/film/*/lists/*
// @excludeMatch   https://letterboxd.com/film/*/members/*
// @excludeMatch   https://letterboxd.com/film/*/reviews/*
// @grant          GM.xmlHttpRequest
// @run-at         document-end
// @noframes
// @compatible     edge Violentmonkey
// @compatible     chrome Violentmonkey
// @supportURL     https://github.com/JenieX/user-js/issues
// @homepageURL    https://github.com/JenieX/user-js/tree/main/src/lb-actors-avatars
// @updateURL      https://github.com/JenieX/user-js/raw/main/dist/lb-actors-avatars/lb-actors-avatars.meta.js
// @downloadURL    https://github.com/JenieX/user-js/raw/main/dist/lb-actors-avatars/lb-actors-avatars.user.js
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

const fishX = {
  blob: async (url, options) => fishBlob(url, options, true),
  buffer: async (url, options) => fishBuffer(url, options, true),
  document: async (url, options) => fishDocument(url, options, true),
  JSON: async (url, options) => fishJSON(url, options, true),
  text: async (url, options) => fishText(url, options, true),
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

function addAvatars({ avatars, elements }) {
  const container = elements[0]?.parentElement;

  for (const element of [...elements].reverse()) {
    const avatarImage = avatars[element.textContent];
    if (avatarImage !== undefined) {
      element.classList.add('actor-with-avatar');
      const actorName = element.textContent;
      element.firstChild.remove();
      const characterName = element.dataset.originalTitle;
      element.dataset.originalTitle = `${actorName}  |  ${characterName}`;
      element.style.setProperty('background', `url('${avatarImage}')`);
      // Move element to the top.
      container.prepend(element);
    }
  }
}

const selectors = {
  imdb: {
    avatar: 'section[cel_widget_id="StaticFeature_Cast"] img.ipc-image',
  },
  letterboxd: {
    actor: '#tab-cast a[href^="/actor/"',
    imdb: 'a[href*="www.imdb.com/title/"]',
  },
};

async function fetchAvatars() {
  const imdbLink = $(selectors.letterboxd.imdb).href;
  const documentX = await fishX.document(imdbLink);
  const avatarsElements = $$(selectors.imdb.avatar, documentX.body);
  const map = {};

  for (const { alt: name, src } of avatarsElements) {
    map[name] = src;
  }

  return map;
}

function getElements() {
  try {
    $('#show-cast-overflow').click();
  } catch {}

  const actorsElements = $$(selectors.letterboxd.actor);

  return actorsElements;
}

async function main() {
  const avatars = await fetchAvatars();
  const elements = getElements();
  addStyle('.actor-with-avatar{background-size:cover!important;border-radius:50%;height:70px;margin-right:5px!important;width:70px}.actor-with-avatar>img{height:70px}');
  addAvatars({ avatars, elements });
}

main().catch((exception) => {
  console.error(exception);
});
