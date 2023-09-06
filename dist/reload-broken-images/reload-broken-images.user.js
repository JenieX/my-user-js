// ==UserScript==
// @name           jx-reload-broken-images
// @version        0.0.3
// @namespace      https://github.com/JenieX/user-js
// @description    Provides a command that searches for broken images and reload them.
// @author         JenieX
// @match          *://*/*
// @grant          GM.registerMenuCommand
// @run-at         document-end
// @noframes
// @compatible     edge Violentmonkey
// @compatible     chrome Violentmonkey
// @supportURL     https://github.com/JenieX/user-js/issues
// @homepageURL    https://github.com/JenieX/user-js/tree/main/src/reload-broken-images
// @updateURL      https://github.com/JenieX/user-js/raw/main/dist/reload-broken-images/reload-broken-images.meta.js
// @downloadURL    https://github.com/JenieX/user-js/raw/main/dist/reload-broken-images/reload-broken-images.user.js
// @icon           https://www.google.com/s2/favicons?sz=64&domain=violentmonkey.github.io
// @license        MIT
// ==/UserScript==

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

function alert(message) {
  if (message === undefined) {
    window.alert(`[ ${scriptName} ]`);

    return;
  }

  window.alert(`[ ${scriptName} ]\n\n${message}`);
}

function confirm(message) {
  return window.confirm(`[ ${scriptName} ]\n\n${message}`);
}

/**
 * Waits for image to fully load or throws an error if it fails.
 */
async function imageLoad(img) {
  return new Promise((resolve, reject) => {
    if (img.complete) {
      resolve();

      return;
    }

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

let busy = false;

function isBrokenImage(img) {
  return img.naturalWidth === 0 && img.naturalHeight === 0;
}

function isHiddenImage(img) {
  const isHidden = img.style.getPropertyValue('display') === 'none';
  const isParentHidden = img.parentElement.style.getPropertyValue('display') === 'none';

  return isHidden || isParentHidden;
}

async function reloadBrokenImages() {
  if (document.readyState !== 'complete') {
    alert('The page is not fully loaded yet!');

    return;
  }

  if (busy === true) {
    alert('There is already a previous command in progress..');

    return;
  }

  busy = true;
  const imgs = document.querySelectorAll('img');

  const brokenImgs = [...imgs].filter((img) => {
    const hasSource = img.getAttribute('src') !== null && img.getAttribute('src') !== '';

    return hasSource && isBrokenImage(img) && !isHiddenImage(img);
  });

  if (brokenImgs.length === 0) {
    alert('No broken images found!');
    busy = false;

    return;
  }

  if (!confirm(`Found ${brokenImgs.length} broken images, reload all?`)) {
    busy = false;

    return;
  }

  /** Still broken images counter */
  let counter = 0;

  for (const img of brokenImgs) {
    img.removeAttribute('loading');
    img.setAttribute('src', img.src);

    try {
      await imageLoad(img);
    } catch {
      counter += 1;
      console.error(logId, `Couldn't reload: ${img.src}`);
    }
  }

  if (counter === 0) {
    alert('All broken images have been successfully reloaded.');
  } else {
    alert(`Couldn't reload ${counter} images. Try repeating the process if necessary.`);
  }

  busy = false;
}

GM.registerMenuCommand('Reload broken images', reloadBrokenImages);
