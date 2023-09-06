// ==UserScript==
// @name           jx-instagram-scroll-carousel
// @version        0.0.1
// @namespace      https://github.com/JenieX/user-js
// @description    Adds functionality to easily scroll through media on Instagram carousel posts
// @author         JenieX
// @match          https://www.instagram.com/*
// @run-at         document-start
// @noframes
// @compatible     edge Violentmonkey
// @compatible     chrome Violentmonkey
// @supportURL     https://github.com/JenieX/user-js/issues
// @homepageURL    https://github.com/JenieX/user-js/tree/main/src/ig-scroll-carousel
// @updateURL      https://github.com/JenieX/user-js/raw/main/dist/ig-scroll-carousel/ig-scroll-carousel.meta.js
// @downloadURL    https://github.com/JenieX/user-js/raw/main/dist/ig-scroll-carousel/ig-scroll-carousel.user.js
// @icon           https://www.google.com/s2/favicons?sz=64&domain=www.instagram.com
// @license        MIT
// ==/UserScript==

function getButton(element, type) {
  const selector = type === 'next' ? 'button[aria-label="Next"]' : 'button[aria-label="Go Back"]';

  return element.querySelector(selector);
}

let busy = false;

function clickButton(element) {
  if (busy === false) {
    busy = true;
    setTimeout(() => { busy = false; }, 300);
    element.click();
  }
}

window.addEventListener('wheel', (event) => {
  const { pathname } = window.location;
  if (!pathname.startsWith('/p/') && pathname !== '/') {
    return;
  }

  const { target } = event;
  if (target === null || !(target instanceof HTMLElement)) {
    return;
  }

  const carouselContainer = target.closest('ul._acay');
  if (carouselContainer === null) {
    return;
  }

  event.preventDefault();
  const buttonsParentElement = carouselContainer.closest('._aao_');
  const scrollDirection = event.deltaY > 0 ? 'down' : 'up';
  if (scrollDirection === 'down') {
    const nextButton = getButton(buttonsParentElement, 'next');
    if (nextButton !== null) {
      clickButton(nextButton);
    }
  } else {
    const previousButton = getButton(buttonsParentElement, 'previous');
    if (previousButton !== null) {
      clickButton(previousButton);
    }
  }
}, { passive: false });
