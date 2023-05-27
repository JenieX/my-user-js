// ==UserScript==
// @name           jx-reload-broken-images
// @version        0.0.1
// @namespace      https://github.com/JenieX/user-js
// @description    Provide a command that searches for broken images and reload them.
// @author         JenieX
// @match          *://*/*
// @grant          GM.registerMenuCommand
// @run-at         document-end
// @noframes
// @compatible     edge Violentmonkey
// @compatible     chrome Violentmonkey
// @supportURL     https://github.com/JenieX/user-js/issues
// @homepageURL    https://github.com/JenieX/user-js/tree/main/src/user-js/reload-broken-images
// @updateURL      https://github.com/JenieX/user-js/raw/main/dist/reload-broken-images/reload-broken-images.meta.js
// @downloadURL    https://github.com/JenieX/user-js/raw/main/dist/reload-broken-images/reload-broken-images.user.js
// @icon           https://www.google.com/s2/favicons?sz=64&domain=violentmonkey.github.io
// @license        MIT
// ==/UserScript==

let busy = false;

function isBrokenImage(img) {
  return img.naturalWidth === 0 && img.naturalHeight === 0;
}

function isHiddenImage(img) {
  const isHidden = img.style.getPropertyValue('display') === 'none';
  const isParentHidden = img.parentElement.style.getPropertyValue('display') === 'none';

  return isHidden || isParentHidden;
}

async function reloadImage(img) {
  return new Promise((resolve) => {
    img.removeAttribute('loading');

    const doneCallback = () => {
      img.removeEventListener('load', doneCallback);
      img.removeEventListener('error', doneCallback);
      resolve();
    };

    img.addEventListener('load', doneCallback);
    img.addEventListener('error', doneCallback);
    img.setAttribute('src', img.src);
  });
}

async function main() {
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
    return img.src !== '' && isBrokenImage(img) && !isHiddenImage(img);
  });

  if (brokenImgs.length === 0) {
    alert('No broken images found!');
    busy = false;

    return;
  }

  if (!window.confirm(`Found ${brokenImgs.length} broken images, reload all?`)) {
    busy = false;

    return;
  }

  for (const img of brokenImgs) {
    await reloadImage(img);
  }

  alert('Done reloading! \n\nRepeat the process if some images are still broken.');
  busy = false;
}

GM.registerMenuCommand('Reload broken images', main);
