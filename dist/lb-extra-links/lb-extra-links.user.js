// ==UserScript==
// @name           jx-letterboxd-extra-links
// @version        0.1.0
// @namespace      https://github.com/JenieX/user-js
// @description    Exposes the IMDb link of movies in the popup menu of posters
// @author         JenieX
// @match          https://letterboxd.com/*/films/*
// @match          https://letterboxd.com/film/*
// @run-at         document-start
// @noframes
// @compatible     edge Violentmonkey
// @compatible     chrome Violentmonkey
// @supportURL     https://github.com/JenieX/user-js/issues
// @homepageURL    https://github.com/JenieX/user-js/tree/main/src/lb-extra-links
// @updateURL      https://github.com/JenieX/user-js/raw/main/dist/lb-extra-links/lb-extra-links.meta.js
// @downloadURL    https://github.com/JenieX/user-js/raw/main/dist/lb-extra-links/lb-extra-links.user.js
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

/** The initial tab URL on the script run. */
const tabURL = window.location.href;

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

const IMDB = {
  label: 'IMDb',
  template: 'https://www.imdb.com/title/%s/',
};

const TL = {
  label: 'Search TL',
  template: 'https://www.torrentleech.org/torrents/browse/index/query/%s/orderby/size/order/desc',
};

const TG = {
  label: 'Search TG',
  template: 'https://torrentgalaxy.to/torrents.php?search=%s&%3Bsort=size&%3Border=desc&sort=size&order=desc',
};

const templates = [IMDB, TL, TG];

function createItem({ label, template, replacement, className }) {
  const element = document.createElement('li');
  const child = document.createElement('a');
  if (template === undefined) {
    child.setAttribute('href', '#');
  } else {
    child.setAttribute('href', template.replace('%s', replacement));
    child.setAttribute('target', '_blank');
  }

  child.textContent = label;
  if (className !== undefined) {
    element.setAttribute('class', className);
  }

  element.append(child);

  return element;
}

function createItems(imdbID, className) {
  const elements = [];
  let finalTemplates = templates;
  /**
   * Remove the first item that is `imdb`, if on a film page. And as it happened, items
   * in there do not require a class name.
   */
  if (className === undefined) {
    finalTemplates = templates.slice(1);
  }

  for (const { label, template } of finalTemplates) {
    const element = createItem({
      label,
      template,
      replacement: imdbID,
      className,
    });

    elements.push(element);
  }

  return elements;
}

function getIdentifier(parent) {
  const element = $('a[href^="http://www.imdb.com/title/"', parent);
  const id = element.href.split('/')[4];

  return id;
}

function rebuildContent(htmlContent) {
  const tempElement = document.createElement('div');
  tempElement.innerHTML = htmlContent;

  try {
    // Cleanup
    const proElement = $('a[href="/pro/"]', tempElement);
    proElement.parentElement?.remove();
    $('.js-actions-panel > .panel-sharing').remove();
  } catch {}

  try {
    const filmID = getIdentifier();
    const extraElements = createItems(filmID);

    for (const extraElement of extraElements) {
      tempElement.append(extraElement);
    }
  } catch {}

  return tempElement.innerHTML;
}

function filmPageHandler() {
  const innerHTMLSetter = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML').set;
  Object.defineProperty(Element.prototype, 'innerHTML', {
    set(value) {
      if (value.includes('PATRON')) {
        const updatedValue = rebuildContent(value.replace('PATRON', 'LOL'));
        innerHTMLSetter.call(this, updatedValue);

        return;
      }

      innerHTMLSetter.call(this, value);
    },
  });
}

const username = tabURL.split('/')[3];
let isMyPage = false;

/**
 * Adds the user activity link for that film
 */
function addActivity(listElement) {
  if (isMyPage) {
    return;
  }

  const myActivityLinkElement = $('.fm-show-activity.popup-menu-text > a', listElement);
  const myActivityLink = myActivityLinkElement.getAttribute('href');
  if (myActivityLink.startsWith(`/${username}`)) {
    isMyPage = true;

    return;
  }

  const userActivityTemplate = `/%s/${myActivityLink.split('/').slice(2, -1).join('/')}`;

  const userActivityElement = createItem({
    label: 'Show user activity',
    template: userActivityTemplate,
    replacement: username,
    className: 'popup-menu-text',
  });

  myActivityLinkElement.parentElement.insertAdjacentElement('afterend', userActivityElement);
}

function addElements(parent, filmID) {
  const extraElements = createItems(filmID, 'popup-menu-text');

  for (const extraElement of extraElements) {
    parent.append(extraElement);
  }
}

async function fetchIdentifier(filmLink) {
  const documentX = await fish.document(filmLink);

  return getIdentifier(documentX.body);
}

function modifyList(listElement) {
  const filmLinkElement = $('li.fm-film-page.popup-menu-text > a', listElement);
  const filmLink = filmLinkElement.href;
  // Cleanup
  filmLinkElement.parentElement.remove();
  $('a[href^="/film/"][href$="/watch/"]', listElement).parentElement.remove();
  // Adding the extra elements
  // Inspired by: https://github.com/theredsox/letterboxd
  addActivity(listElement);

  const loaderElement = createItem({
    label: 'Load extra links',
    className: 'popup-menu-text',
  });

  listElement.append(loaderElement);
  loaderElement.addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    loaderElement.firstElementChild.textContent = 'Loading';

    try {
      const filmID = await fetchIdentifier(filmLink);
      addElements(listElement, filmID);
    } catch {}

    loaderElement.remove();
  }, { capture: true, once: true });
}

function userPageHandler() {
  const { setAttribute } = Element.prototype;
  let setAttributeOverride;
  // eslint-disable-next-line prefer-const
  setAttributeOverride = function override1(name, value) {
    // console.log(setAttributeOverride.name);
    if (name === 'class' && value === 'fm-film-page popup-menu-text -last') {
      const listElement = this.parentElement;

      try {
        modifyList(listElement);
      } catch (exception) {
        console.error(exception);
      }
    }

    return setAttribute.call(this, name, value);
  };

  Element.prototype.setAttribute = setAttributeOverride;
}

if (tabURL.startsWith('https://letterboxd.com/film/')) {
  filmPageHandler();
} else {
  userPageHandler();
}
