import './js/commands';
import './js/detectors';
import './js/listeners';
import './js/similar-rating';
import { $$, tabURL, addStyle, pageLoad } from '@jeniex/utils/browser';
import modifyTable from './js/modify-table';
import attachTooltip from './js/attach-tooltip';
import { clearExpired } from './js/storage';
import { removeFilter } from './js/cookies';
import { IS_ANDROID } from './js/constants';

// ------------------------
async function main(): Promise<void> {
  await pageLoad();

  try {
    const avatarsElements = $$('.person-summary > a.avatar');

    for (const avatarsElement of avatarsElements) {
      attachTooltip(avatarsElement as HTMLAnchorElement).catch(() => {});
    }
  } catch {}
}

if (IS_ANDROID) {
  main().catch((exception) => {
    console.log((exception as Error).message);
  });
} else {
  const { setAttribute } = Element.prototype;
  let setAttributeOverride: Element['setAttribute'];

  // eslint-disable-next-line prefer-const
  setAttributeOverride = function override2(this: HTMLElement, name, value): void {
    // console.log(setAttributeOverride.name);

    if (name === 'data-original-title' && this.matches('a.avatar')) {
      attachTooltip(this as HTMLAnchorElement).catch(() => {});
    }

    return setAttribute.call(this, name, value);
  };

  Element.prototype.setAttribute = setAttributeOverride;
}

// ------------------------------------------------ START

/**
 * To remove the filter cookie that was added, just incase the page was closed before
 * the request for data is complete and the cookie is removed there.
 */
if (!/letterboxd\.com\/[^/]+\/films\//.test(tabURL)) {
  // TODO Mention the side effect of this on the behavior of using Letterboxd filter feature
  window.addEventListener('beforeunload', removeFilter);
}

addStyle('include-file: style.min.css');
addStyle('include-file: cleanup.min.css');
clearExpired();

// ------------------------

const matchesWideTablePage = (
  /letterboxd\.com\/[^/]+\/(following|followers)\//.test(tabURL) ||
  /letterboxd\.com\/[^/]+\/friends\/film\//.test(tabURL) ||
  /letterboxd\.com\/film\/[^/]+\/(likes|members|fans)\//.test(tabURL)
);

if (matchesWideTablePage === true) {
  modifyTable().catch(() => {
    // alert((exception as Error).message);
  });
}

// ------------------------------------------------  END

// TODO Get watchlist anonymously to match the films pages
// TODO Refresh my films anonymously too
// TODO https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
// FIXME Self hover not listing not rated films
// TODO First run to set the username and warn about updating
// TODO Disable (or only enable on specific pages) on pages like:
// https://letterboxd.com/eely/film/coherence/activity/
// https://letterboxd.com/activity/
// TODO Logging a film doesn't get its rating detected

// ------------------------

// TODO listener for another script that adds the Match: %13
/* setTimeout(() => {
  // Creating and Firing a Custom Event using document
  const customEvent = new CustomEvent('myCustomEvent', {
    detail: { message: 'Hello from the same context!' },
  });

  // Dispatch the custom event on the document
  document.dispatchEvent(customEvent);
}, 10_000);

document.addEventListener('myCustomEvent', (event) => {
  console.log(event);
});
 */
