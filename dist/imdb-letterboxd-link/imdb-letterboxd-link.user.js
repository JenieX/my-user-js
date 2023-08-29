// ==UserScript==
// @name           jx-imdb-letterboxd-link
// @version        0.0.1
// @namespace      https://github.com/JenieX/user-js
// @description    Provides the corresponding Letterboxd links of movies if available.
// @author         JenieX
// @match          https://www.imdb.com/title/*/*
// @grant          GM.xmlHttpRequest
// @grant          GM.getResourceUrl
// @resource       letterboxdLogo https://github.com/JenieX/user-js/blob/main/src/user-js/imdb-letterboxd-link/assets/sprite.svg?raw=true
// @run-at         document-start
// @noframes
// @compatible     edge Violentmonkey
// @compatible     chrome Violentmonkey
// @supportURL     https://github.com/JenieX/user-js/issues
// @homepageURL    https://github.com/JenieX/user-js/tree/main/src/user-js/imdb-letterboxd-link
// @updateURL      https://github.com/JenieX/user-js/raw/main/dist/imdb-letterboxd-link/imdb-letterboxd-link.meta.js
// @downloadURL    https://github.com/JenieX/user-js/raw/main/dist/imdb-letterboxd-link/imdb-letterboxd-link.user.js
// @icon           https://www.google.com/s2/favicons?sz=64&domain=www.imdb.com
// @license        MIT
// ==/UserScript==

async function createElement(link) {
  const divElement = document.createElement('div');
  divElement.id = 'imdb-letterboxd-link';
  const aElement = document.createElement('a');
  aElement.setAttribute('href', link);
  aElement.setAttribute('class', 'imdb-letterboxd-logo');
  aElement.setAttribute('target', '_blank');
  const blobURL = await GM.getResourceUrl('letterboxdLogo');
  if (blobURL === undefined || blobURL === '') {
    throw new Error('There was an error loading the Letterboxd logo.');
  }

  aElement.style.setProperty('background', `url('${blobURL}')`);
  aElement.style.setProperty('background-position', '0 -800px');
  aElement.style.setProperty('background-size', '800px 1020px');
  divElement.append(aElement);
  document.documentElement.append(divElement);
}

const SCRIPT_NAME = (typeof GM === 'undefined' ? GM_info : GM.info).script.name;
/** The identifier of the script to be used in logging */
const LOG_ID = `[${SCRIPT_NAME}]:`;
/** The initial tab URL on the script run */
const TAB_URL = window.location.href;

function addStyle(css, parent = document.documentElement) {
  const style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.textContent = css;
  parent.append(style);

  return style;
}

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
// https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
/**
 * When setting the cookie header, anonymous property must be set to `true`
 * https://violentmonkey.github.io/api/gm/#gm_xmlhttprequest
 */
async function fishXResponse(url, fishOptions = {}) {
  const { method, headers, anonymous, body, onProgress } = fishOptions;

  return new Promise((resolve, reject) => {
    GM.xmlHttpRequest({
      url,
      method: method ?? 'GET',
      headers,
      // @ts-expect-error
      anonymous,
      data: body,
      responseType: 'blob',
      onprogress: onProgress,
      onload({ response, statusText, status, finalUrl }) {
        const ok = status >= 200 && status < 300;
        if (!ok) {
          reject(new Error(`Request to ${url} ended with ${status} status`));

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
        reject(new Error(`Request to ${url} ended with ${status} status`));
      },
    });
  });
}

function getIdentifier() {
  return TAB_URL.split('/')[4];
}

async function fetchLink(imdbIdentifier) {
  const linkInStorage = sessionStorage.getItem(imdbIdentifier);
  if (linkInStorage !== null) {
    return linkInStorage;
  }

  const url = `https://letterboxd.com/imdb/${imdbIdentifier}/`;
  const response = await fishXResponse(url);
  if (response.url === url) {
    throw new Error(`No-one has added "${imdbIdentifier}" yet.`);
  }

  sessionStorage.setItem(imdbIdentifier, response.url);

  return response.url;
}

async function main() {
  const imdbIdentifier = getIdentifier();
  // May throw an error!
  const link = await fetchLink(imdbIdentifier);
  await createElement(link);
  addStyle('#imdb-letterboxd-link{left:0;position:fixed;top:0;z-index:100000}#imdb-letterboxd-link>a{display:block;height:40px;width:62px}');
}

main().catch((exception) => {
  console.error(LOG_ID, exception);
});
