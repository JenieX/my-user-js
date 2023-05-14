// ==UserScript==
// @name           jx-instagram-splash-screen
// @version        0.0.1
// @namespace      https://github.com/JenieX/user-js
// @description    Modifies the splash screen to a dark bluish splash screen with a white logo
// @author         JenieX
// @match          https://www.instagram.com/*
// @run-at         document-start
// @noframes
// @compatible     edge Violentmonkey
// @compatible     chrome Violentmonkey
// @supportURL     https://github.com/JenieX/user-js/issues
// @homepageURL    https://github.com/JenieX/user-js/tree/main/src/user-js/ig-splash-screen
// @updateURL      https://github.com/JenieX/user-js/raw/main/dist/ig-splash-screen/ig-splash-screen.meta.js
// @downloadURL    https://github.com/JenieX/user-js/raw/main/dist/ig-splash-screen/ig-splash-screen.user.js
// @icon           https://www.google.com/s2/favicons?sz=64&domain=www.instagram.com
// @license        MIT
// ==/UserScript==

function addStyle(css, parent = document.documentElement) {
  const style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.textContent = css;
  parent.append(style);

  return style;
}

const splashScreenFrame = document.createElement('iframe');
splashScreenFrame.setAttribute('id', 'ig-splash-screen');
document.documentElement.append(splashScreenFrame);
addStyle('body{background-color:#081017}svg{fill:#fff;inset:0;margin:auto;position:absolute}', splashScreenFrame.contentDocument.head);
splashScreenFrame.contentDocument.body.insertAdjacentHTML('beforeend', '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 50 50"><path d="M16 3C8.832 3 3 8.832 3 16v18c0 7.168 5.832 13 13 13h18c7.168 0 13-5.832 13-13V16c0-7.168-5.832-13-13-13H16zm0 2h18c6.086 0 11 4.914 11 11v18c0 6.086-4.914 11-11 11H16C9.914 45 5 40.086 5 34V16C5 9.914 9.914 5 16 5zm21 6a2 2 0 0 0-2 2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0-2-2zm-12 3c-6.063 0-11 4.937-11 11s4.937 11 11 11 11-4.937 11-11-4.937-11-11-11zm0 2c4.982 0 9 4.018 9 9s-4.018 9-9 9-9-4.018-9-9 4.018-9 9-9z"/></svg>');
const mainStyle = addStyle('body,html{overflow:hidden}::-webkit-scrollbar{display:none}iframe#ig-splash-screen{border:0;height:100%;inset:0;position:fixed;width:100%;z-index:3000}');

function detectSplashScreen(mutations, observer) {
  for (const { target } of mutations) {
    if (target.nodeType === Node.ELEMENT_NODE &&
            target instanceof HTMLDivElement &&
            target.matches('#splash-screen') &&
            target.style.getPropertyValue('display') === 'none') {
      observer.disconnect();
      splashScreenFrame.remove();
      mainStyle.remove();

      return;
    }
  }
}

new MutationObserver(detectSplashScreen).observe(document, {
  attributeFilter: ['style'],
  subtree: true,
});
