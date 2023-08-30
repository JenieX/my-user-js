// ==UserScript==
// @name           jx-inspector
// @version        0.0.1
// @namespace      https://github.com/JenieX/user-js
// @description    Open the DevTools for pages
// @author         JenieX
// @match          *://*/*
// @match          file:///*
// @grant          GM.registerMenuCommand
// @grant          GM.setValue
// @grant          GM.getValue
// @run-at         document-start
// @noframes
// @compatible     edge Violentmonkey
// @compatible     chrome Violentmonkey
// @supportURL     https://github.com/JenieX/user-js/issues
// @homepageURL    https://github.com/JenieX/user-js/tree/main/src/user-js/inspector
// @updateURL      https://github.com/JenieX/user-js/raw/main/dist/inspector/inspector.meta.js
// @downloadURL    https://github.com/JenieX/user-js/raw/main/dist/inspector/inspector.user.js
// @icon           https://www.google.com/s2/favicons?sz=64&domain=violentmonkey.github.io
// @license        MIT
// ==/UserScript==

const SCRIPT_NAME = (typeof GM === 'undefined' ? GM_info : GM.info).script.name;

function alert$1(message) {
  if (message === undefined) {
    window.alert(`[ ${SCRIPT_NAME} ]`);

    return;
  }

  window.alert(`[ ${SCRIPT_NAME} ]\n\n${message}`);
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

const fishX = {
  async buffer(url, fishOptions) {
    const response = await fishXResponse(url, fishOptions);
    const responseBuffer = await response.arrayBuffer();

    return responseBuffer;
  },
  async blob(url, fishOptions) {
    const response = await fishXResponse(url, fishOptions);
    const responseBlob = await response.blob();

    return responseBlob;
  },
  async json(url, fishOptions) {
    const response = await fishXResponse(url, fishOptions);
    const responseJSON = await response.json();

    return responseJSON;
  },
  async text(url, fishOptions) {
    const response = await fishXResponse(url, fishOptions);
    const responseText = await response.text();

    return responseText;
  },
  async document(url, fishOptions) {
    const response = await fishXResponse(url, fishOptions);
    const responseText = await response.text();
    const parser = new DOMParser();

    return parser.parseFromString(responseText, 'text/html');
  },
};

async function sleep(milliSeconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliSeconds);
  });
}

async function getIdentifier(port, targetURL) {
  const debugEntries = await fishX.json(`http://localhost:${port}/json`);

  const matchedEntries = debugEntries.filter(({ url }) => {
    return url === (targetURL ?? window.location.href);
  });

  if (matchedEntries.length === 1) {
    return matchedEntries[0].devtoolsFrontendUrl;
  }

  throw new Error('There are multiple/no pages by the provided URL!');
}

async function OpenDevTools(port, targetURL) {
  try {
    const devtoolsFrontendURL = await getIdentifier(port, targetURL);
    window.open(`http://localhost:${port}${devtoolsFrontendURL}`);
  } catch (exception) {
    alert(exception.message);
  }
}

async function setPort() {
  const port = Number(prompt('Provide your browser debugging port:'));
  console.warn({ port });
  if (Number.isNaN(port) || port < 1000 || port > 9999) {
    console.error('Invalid port!');
    throw new Error('Invalid port!');
  } else {
    console.log('LOL');
  }

  await GM.setValue('port', port);

  return port;
}

async function getPort() {
  const port = await GM.getValue('port');
  if (port === undefined) {
    return setPort();
  }

  return port;
}

const PR_BACKGROUND_PAGE_URL = 'chrome-extension://bpiomkmniogokfcahjbbmabknjljbcjc/_generated_background_page.html';

const VM_BACKGROUND_PAGE_URL = 'chrome-extension://jinjaccalgkegednnccohejagnlnfdag/_generated_background_page.html';

async function main() {
  const port = await getPort();
  // Gets the tab URL dynamically ever time the command is initiated.
  GM.registerMenuCommand('Inspect page', OpenDevTools.bind(undefined, port, undefined));
  GM.registerMenuCommand('Inspect VM', OpenDevTools.bind(undefined, port, VM_BACKGROUND_PAGE_URL));
  GM.registerMenuCommand('Inspect PR', OpenDevTools.bind(undefined, port, PR_BACKGROUND_PAGE_URL));
  GM.registerMenuCommand('Set port', async () => {
    try {
      await setPort();
      window.location.reload();
    } catch (exception) {
      await sleep(100);
      alert$1(exception.message);
    }
  });
}

main().catch(async (exception) => {
  await sleep(100);
  alert$1(exception.message);
});