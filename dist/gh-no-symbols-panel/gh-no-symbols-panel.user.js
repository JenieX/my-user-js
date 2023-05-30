// ==UserScript==
// @name           jx-github-no-symbols-panel
// @version        0.0.1
// @namespace      https://github.com/JenieX/user-js
// @description    An attempt to disable the annoying symbols panel.
// @author         JenieX
// @match          https://github.com/*
// @run-at         document-start
// @noframes
// @compatible     edge Violentmonkey
// @compatible     chrome Violentmonkey
// @supportURL     https://github.com/JenieX/user-js/issues
// @homepageURL    https://github.com/JenieX/user-js/tree/main/src/user-js/gh-no-symbols-panel
// @updateURL      https://github.com/JenieX/user-js/raw/main/dist/gh-no-symbols-panel/gh-no-symbols-panel.meta.js
// @downloadURL    https://github.com/JenieX/user-js/raw/main/dist/gh-no-symbols-panel/gh-no-symbols-panel.user.js
// @icon           https://www.google.com/s2/favicons?sz=64&domain=github.com
// @license        MIT
// ==/UserScript==

function addStyle(css, parent = document.documentElement) {
  const style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.textContent = css;
  parent.append(style);

  return style;
}

addStyle('span[aria-label="Open symbols panel"]{display:none}');
const originalAddEventListener = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = overrideAddEventListener;

function overrideAddEventListener(...args) {
  const [eventName, callback, capture] = args;
  if (eventName === 'mouseup' && callback instanceof Function) {
    const override = (event) => {
      const { target } = event;
      if (target instanceof HTMLTextAreaElement && target.matches('#read-only-cursor-text-area')) {
        return;
      }

      callback(event);
    };

    originalAddEventListener.call(this, eventName, override, capture);

    return;
  }

  originalAddEventListener.call(this, ...args);
}
