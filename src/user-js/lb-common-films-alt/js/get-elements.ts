import { Elements, ResolveGetElements } from './types';

let detectedElements: Elements;
let resolveGetElements: ResolveGetElements;

function detectElements(): void {
  new MutationObserver((mutations: MutationRecord[], observer: MutationObserver): void => {
    for (const mutation of mutations) {
      const { target } = mutation;

      if (target instanceof HTMLElement && target.matches('nav.footer-nav.js-footer-nav')) {
        observer.disconnect();

        const avatarElements = document.querySelectorAll('table.person-table.film-table a.avatar');

        if (resolveGetElements === undefined) {
          detectedElements = avatarElements as Elements;
        } else {
          resolveGetElements(avatarElements as Elements);
        }

        return;
      }
    }
  }).observe(document, {
    childList: true,
    subtree: true,
  });
}

async function getElements(): Promise<Elements> {
  return new Promise<Elements>((resolve) => {
    if (detectedElements === undefined) {
      resolveGetElements = resolve;
    } else {
      resolve(detectedElements);
    }
  });
}

export { detectElements };
export default getElements;
