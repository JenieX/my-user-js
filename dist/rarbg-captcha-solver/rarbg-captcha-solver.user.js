// ==UserScript==
// @name           jx-rarbg-captcha-solver
// @version        0.0.1
// @namespace      https://github.com/JenieX/user-js
// @description    Automatically solves the captcha on Rarbg verifying page.
// @author         JenieX
// @match          https://rarbgmirror.org/threat_defence.php
// @require        https://unpkg.com/tesseract.js@4.0.6/dist/tesseract.min.js
// @run-at         document-end
// @noframes
// @compatible     edge Violentmonkey
// @compatible     chrome Violentmonkey
// @supportURL     https://github.com/JenieX/user-js/issues
// @homepageURL    https://github.com/JenieX/user-js/tree/main/src/user-js/rarbg-captcha-solver
// @updateURL      https://github.com/JenieX/user-js/raw/main/dist/rarbg-captcha-solver/rarbg-captcha-solver.meta.js
// @downloadURL    https://github.com/JenieX/user-js/raw/main/dist/rarbg-captcha-solver/rarbg-captcha-solver.user.js
// @icon           https://www.google.com/s2/favicons?sz=64&domain=rarbgmirror.org
// @license        MIT
// ==/UserScript==

function $(selector, parent) {
  const element = (parent ?? document).querySelector(selector);
  if (element === null) {
    throw new Error(`Couldn't find the element with the selector ${selector}`);
  }

  return element;
}

async function waitForImageLoad(img) {
  if (img.complete) {
    return;
  }

  // eslint-disable-next-line consistent-return
  return new Promise((resolve, reject) => {
    let onLoad;
    let onError;

    const removeListeners = () => {
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onError);
    };

    onLoad = () => {
      removeListeners();
      resolve();
    };

    onError = () => {
      removeListeners();
      reject(new Error('Image failed to load'));
    };

    img.addEventListener('load', onLoad);
    img.addEventListener('error', onError);
  });
}

async function transformImage(img) {
  await waitForImageLoad(img);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  const dataUrl = canvas.toDataURL('image/png');
  img.setAttribute('src', dataUrl);
  await waitForImageLoad(img);
}

async function main() {
  if (!window.location.href.includes('?defence=2')) {
    return;
  }

  const img = $('img[src^="/threat_captcha.php"]');
  await transformImage(img);
  const result = await window.Tesseract.recognize(img);
  const captchaSolution = result.data.text.trim();
  const inputElement = $('#solve_string');
  inputElement.setAttribute('value', captchaSolution);
  $('#button_submit').click();
}

main().catch((exception) => console.error(exception));
