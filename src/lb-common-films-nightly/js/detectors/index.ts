import rate from './rate';
import { DetectedResponse } from '../types';
import { markAsWatched, markAsNotWatched } from './watched';

const XHROpen = window.XMLHttpRequest.prototype.open;
window.XMLHttpRequest.prototype.open = XHROpenOverride;

const detectTypes = new Set<string | undefined>([
  'mark-as-not-watched',
  'mark-as-watched',
  'rate',
]);

function XHROpenOverride(this: XMLHttpRequest, ...args: [ string, string ]): unknown {
  const instance = this;
  const [, url] = args;

  const [, pathName, filmID, type] = url.split('/');

  if (url.includes('sidebar-user-actions')) {
    instance.addEventListener('readystatechange', async () => {
      if (instance.readyState === XMLHttpRequest.DONE) {
        // console.log('PATRON', instance);
      }
    });
  }

  if (pathName !== 'film' || !detectTypes.has(type)) {
    return Reflect.apply(XHROpen, instance, args);
  }

  instance.addEventListener('readystatechange', async () => {
    if (instance.readyState === XMLHttpRequest.DONE) {
      const {
        result,
        rating,
        film: { name },
      } = JSON.parse(instance.responseText) as DetectedResponse;

      if (result !== true) {
        return;
      }

      switch (type) {
        case 'mark-as-not-watched': {
          await markAsNotWatched({ id: filmID! });

          break;
        }

        case 'mark-as-watched': {
          await markAsWatched({ id: filmID!, name });

          break;
        }

        case 'rate': {
          await rate({ id: filmID!, rating: rating!, name });

          break;
        }
      }
    }
  });

  return Reflect.apply(XHROpen, instance, args);
}
