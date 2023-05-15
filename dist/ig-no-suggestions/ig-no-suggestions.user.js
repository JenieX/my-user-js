// ==UserScript==
// @name           jx-instagram-no-suggestions
// @version        0.0.1
// @namespace      https://github.com/JenieX/user-js
// @description    Removes the suggested posts from Instagram timeline
// @author         JenieX
// @match          https://www.instagram.com/*
// @run-at         document-start
// @noframes
// @compatible     edge Violentmonkey
// @compatible     chrome Violentmonkey
// @supportURL     https://github.com/JenieX/user-js/issues
// @homepageURL    https://github.com/JenieX/user-js/tree/main/src/user-js/ig-no-suggestions
// @updateURL      https://github.com/JenieX/user-js/raw/main/dist/ig-no-suggestions/ig-no-suggestions.meta.js
// @downloadURL    https://github.com/JenieX/user-js/raw/main/dist/ig-no-suggestions/ig-no-suggestions.user.js
// @icon           https://www.google.com/s2/favicons?sz=64&domain=www.instagram.com
// @license        MIT
// ==/UserScript==

const originalOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = overrideOpen;

/**
 * Overrides the XMLHttpRequest.open method to simply store the request URL
 */
function overrideOpen(...args) {
  const [, url] = args;
  // @ts-expect-error
  this.requestURL = url;
  Reflect.apply(originalOpen, this, args);
}

function isTimeLineRequest(requestURL) {
  const timeLineRequestURL = 'https://www.instagram.com/api/v1/feed/timeline';
  if (typeof requestURL === 'string' && requestURL.startsWith(timeLineRequestURL)) {
    return true;
  }

  return false;
}

const originalSend = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = overrideSend;
let initialTimeLineRequest = true;

/**
 * Overrides the XMLHttpRequest.send method to provide a 5 seconds delay between
 * the timeline requests, as there a good chance they will fire more rapidly as a result
 * of removing the suggestion posts by this script.
 */
function overrideSend(...args) {
  // @ts-expect-error
  const { requestURL } = this;
  if (!isTimeLineRequest(requestURL) || window.location.search === '?variant=past_posts') {
    Reflect.apply(originalSend, this, args);

    return;
  }

  if (initialTimeLineRequest === true) {
    initialTimeLineRequest = false;
    Reflect.apply(originalSend, this, args);

    return;
  }

  setTimeout(() => {
    Reflect.apply(originalSend, this, args);
  }, 5000);
}

/**
 * Overrides the JSON.parse method to filter out suggested posts from the timeline data
 */
const originalJSONParse = JSON.parse;
JSON.parse = (...args) => {
  const dataJSON = originalJSONParse(...args);
  if (typeof dataJSON === 'string' || dataJSON.feed_items === undefined) {
    return dataJSON;
  }

  dataJSON.feed_items = dataJSON.feed_items.filter((item) => {
    if (item.explore_story !== undefined) {
      return false;
    }

    return true;
  });

  return dataJSON;
};
