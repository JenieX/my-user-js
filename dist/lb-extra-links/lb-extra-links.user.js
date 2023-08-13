// ==UserScript==
// @name           jx-letterboxd-extra-links
// @version        0.0.1
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
// @homepageURL    https://github.com/JenieX/user-js/tree/main/src/user-js/lb-extra-links
// @updateURL      https://github.com/JenieX/user-js/raw/main/dist/lb-extra-links/lb-extra-links.meta.js
// @downloadURL    https://github.com/JenieX/user-js/raw/main/dist/lb-extra-links/lb-extra-links.user.js
// @icon           https://www.google.com/s2/favicons?sz=64&domain=letterboxd.com
// @license        MIT
// ==/UserScript==

const IMDB = {
  label: 'IMDb',
  template: 'https://www.imdb.com/title/%s/',
};

const TL = {
  label: 'TorrentLeech',
  template: 'https://www.torrentleech.org/torrents/browse/index/query/%s/orderby/size/order/desc',
};

const TG = {
  label: 'TorrentGalaxy',
  template: 'https://torrentgalaxy.to/torrents.php?search=%s&%3Bsort=size&%3Border=desc&sort=size&order=desc',
};

const templates = [IMDB, TL, TG];

function createItem({ label, template, imdbID, className }) {
  const element = document.createElement('li');
  const child = document.createElement('a');
  if (template === undefined) {
    child.setAttribute('href', '#');
  } else {
    child.setAttribute('href', template.replace('%s', imdbID));
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
  if (className === undefined) {
    finalTemplates = templates.slice(1);
  }

  for (const { label, template } of finalTemplates) {
    const element = createItem({
      label,
      template,
      imdbID,
      className,
    });

    elements.push(element);
  }

  return elements;
}

function $(selector, parent) {
  const element = (parent ?? document).querySelector(selector);
  if (element === null) {
    throw new Error(`Couldn't find the element with the selector ${selector}`);
  }

  return element;
}

/** The identifier of the script to be used in logging */
/** The initial tab URL on the script run */
const TAB_URL = window.location.href;

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

function addElements(parent, filmID) {
  const extraElements = createItems(filmID, 'popup-menu-text');

  for (const extraElement of extraElements) {
    parent.append(extraElement);
  }
}

async function fetchIdentifier(filmLink, listElement) {
  const documentX = await fish.document(filmLink);

  try {
    const filmID = getIdentifier(documentX.body);
    addElements(listElement, filmID);
  } catch {}
}

function modifyList(listElement) {
  const filmLink = listElement.lastElementChild.firstElementChild.href;
  // Cleanup
  listElement.lastElementChild?.remove();
  listElement.lastElementChild?.remove();

  const loaderElement = createItem({
    label: 'Hover to load links',
    className: 'popup-menu-text',
  });

  const listener = async () => {
    loaderElement.removeEventListener('mouseenter', listener);
    loaderElement.firstElementChild.textContent = 'Loading';
    await fetchIdentifier(filmLink, listElement);
    loaderElement.remove();
  };

  listElement.append(loaderElement);
  loaderElement.addEventListener('mouseenter', listener);
}

function userPageHandler() {
  const { setAttribute } = Element.prototype;
  Element.prototype.setAttribute = setAttributeOverride;

  function setAttributeOverride(name, value) {
    if (name === 'class' && value === 'fm-film-page popup-menu-text -last') {
      const listElement = this.parentElement;
      modifyList(listElement);
    }

    return setAttribute.call(this, name, value);
  }
}

if (TAB_URL.startsWith('https://letterboxd.com/film/')) {
  filmPageHandler();
} else {
  userPageHandler();
}
