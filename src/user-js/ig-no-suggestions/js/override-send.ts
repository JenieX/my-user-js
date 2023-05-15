import { SendArgs } from './types';

function isTimeLineRequest(requestURL: URL | string): boolean {
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
function overrideSend(this: XMLHttpRequest, ...args: SendArgs): void {
  // @ts-expect-error
  const requestURL = this.requestURL as URL | string;

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
