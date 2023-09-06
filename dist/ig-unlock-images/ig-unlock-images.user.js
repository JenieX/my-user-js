// ==UserScript==
// @name           jx-instagram-unlock-images
// @version        0.0.2
// @namespace      https://github.com/JenieX/user-js
// @description    Unlocks Instagram image context menu and provides easy copying and saving
// @author         JenieX
// @match          https://www.instagram.com/*
// @run-at         document-start
// @noframes
// @compatible     edge Violentmonkey
// @compatible     chrome Violentmonkey
// @supportURL     https://github.com/JenieX/user-js/issues
// @homepageURL    https://github.com/JenieX/user-js/tree/main/src/ig-unlock-images
// @updateURL      https://github.com/JenieX/user-js/raw/main/dist/ig-unlock-images/ig-unlock-images.meta.js
// @downloadURL    https://github.com/JenieX/user-js/raw/main/dist/ig-unlock-images/ig-unlock-images.user.js
// @icon           https://www.google.com/s2/favicons?sz=64&domain=www.instagram.com
// @license        MIT
// ==/UserScript==

function unlockImageContextMenu(parent) {
  const emptyDiv = parent.querySelector('._aagw');
  if (emptyDiv !== null) {
    emptyDiv.remove();
  }
}

const imgSourceSetter = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src').set;
Object.defineProperty(HTMLImageElement.prototype, 'src', {
  set(value) {
    imgSourceSetter.call(this, value);
    const hasLink = this.closest('a') !== null;
    if (hasLink) {
      return;
    }

    const emptyDivParent = this.closest('._aagu');
    if (emptyDivParent === null) {
      return;
    }

    unlockImageContextMenu(emptyDivParent);
  },
});
