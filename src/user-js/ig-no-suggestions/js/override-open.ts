import { OpenArgs } from './types';

const originalOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = overrideOpen;

/**
 * Overrides the XMLHttpRequest.open method to simply store the request URL
 */
function overrideOpen(this: XMLHttpRequest, ...args: OpenArgs): void {
  const [, url] = args;

  // @ts-expect-error
  this.requestURL = url;

  Reflect.apply(originalOpen, this, args);
}
