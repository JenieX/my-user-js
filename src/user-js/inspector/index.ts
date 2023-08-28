import OpenDevTools from './js/open';
import { VM_BACKGROUND_PAGE_URL } from './js/pages';
import { alert, sleep } from '../../helpers';
import { getPort, setPort } from './js/config';

async function main(): Promise<void> {
  const port = await getPort();

  GM.registerMenuCommand('Inspect VM', OpenDevTools.bind(undefined, port, VM_BACKGROUND_PAGE_URL));

  // Gets the tab URL dynamically ever time the command is initiated.
  GM.registerMenuCommand('Inspect page', OpenDevTools.bind(undefined, port, undefined));

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
