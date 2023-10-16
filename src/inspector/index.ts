/* eslint-disable max-len */

import { alert, sleep } from '@jeniex/utils/browser';
import OpenDevTools from './js/open';
import { getPort, setPort } from './js/config';
import {
  // PR_BACKGROUND_PAGE_URL,
  VMB_BACKGROUND_PAGE_URL,
  // VM_BACKGROUND_PAGE_URL,
} from './js/pages';

async function main(): Promise<void> {
  const port = await getPort();

  // Gets the tab URL dynamically ever time the command is initiated.
  GM.registerMenuCommand('Inspect page', OpenDevTools.bind(undefined, port, undefined));

  // GM.registerMenuCommand('Inspect VM', OpenDevTools.bind(undefined, port, VM_BACKGROUND_PAGE_URL));
  GM.registerMenuCommand('Inspect VMB', OpenDevTools.bind(undefined, port, VMB_BACKGROUND_PAGE_URL));
  // GM.registerMenuCommand('Inspect PR', OpenDevTools.bind(undefined, port, PR_BACKGROUND_PAGE_URL));

  GM.registerMenuCommand('Set port', async () => {
    try {
      await setPort();
      window.location.reload();
    } catch (exception) {
      await sleep(100);
      alert((exception as Error).message);
    }
  });
}

main().catch(async (exception) => {
  await sleep(100);
  alert((exception as Error).message);
});
