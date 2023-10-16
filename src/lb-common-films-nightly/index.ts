import './js/commands';
import './js/detectors';
import './js/listeners';
import './js/similar-rating';
import { $$, tabURL, addStyle, pageLoad } from '@jeniex/utils/browser';
import attachTooltip from './js/attach-tooltip';
import modifyTable from './js/modify-table';
import { clearExpired } from './js/storage';
import { removeFilter } from './js/cookies';

// ------------------------
async function main(): Promise<void> {
  await pageLoad();

  try {
    const avatarsElements = $$([
      '.person-summary > a.avatar',
      '.profile-mini-person a.avatar',
      'a#avatar-zoom',
    ]);

    for (const avatarsElement of avatarsElements) {
      attachTooltip(avatarsElement as HTMLAnchorElement).catch(() => {});
    }
  } catch {}
}

main().catch((exception) => {
  console.log((exception as Error).message);
});

// ------------------------------------------------ START

/**
 * To remove the filter cookie that was added, just incase the page was closed before
 * the request for data is complete and the cookie is removed there.
 */
if (!/letterboxd\.com\/[^/]+\/films\//.test(tabURL)) {
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

// FIXME Logging a film doesn't get its rating detected
