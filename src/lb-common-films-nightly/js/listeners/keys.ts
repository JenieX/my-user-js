import { $$ } from '@jeniex/utils/browser';
import state from '../state';
import { prepareTooltip } from '../attach-tooltip';

document.addEventListener('keyup', async ({ code: keyName }) => {
  let activeTooltipID: string | undefined;

  try {
    const activeTooltipsElements = $$('.tippy-box');
    if (activeTooltipsElements.length === 1) {
      activeTooltipID = activeTooltipsElements[0]!.parentElement!.id;
    }
  } catch {}

  if (activeTooltipID === undefined) {
    return;
  }

  const instance = state.tippyInstances[activeTooltipID];

  if (instance === undefined) {
    return;
  }

  const keyNames = [
    'Digit1',
    'Digit2',
    'Digit3',
    'Digit4',
    'Digit5',
    'Digit6',
    'Digit7',
    'KeyS',
    'KeyO',
  ];

  if (!keyNames.includes(keyName)) {
    return;
  }

  switch (keyName) {
    case keyNames[0]: {
      await prepareTooltip(instance, 0);
      break;
    }

    case keyNames[1]: {
      await prepareTooltip(instance, 1);
      break;
    }

    case keyNames[2]: {
      await prepareTooltip(instance, 2);
      break;
    }

    case keyNames[3]: {
      await prepareTooltip(instance, 3);
      break;
    }

    case keyNames[4]: {
      await prepareTooltip(instance, 4);
      break;
    }

    case keyNames[5]: {
      await prepareTooltip(instance, 'not-rated');
      break;
    }

    case keyNames[6]: {
      await prepareTooltip(instance, 'watchlisted');
      break;
    }

    case keyNames[7]: {
      const currentSort = instance.options.sort;
      instance.options.sort = (currentSort === 'film-name') ? 'user-rating' : 'film-name';
      await prepareTooltip(instance, state.lasRunFilter);
      break;
    }

    case keyNames[8]: {
      instance.options.sort = 'user-rating';
      await prepareTooltip(instance);
      break;
    }
  }
});
