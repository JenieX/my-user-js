import { $, tabURL, alert, prompt, pageLoad } from '@jeniex/utils/browser';
import refresh from './refresh';
import { MyFilmsX } from '../types';
import { toggleView } from '../cookies';

const commands = [
  'Enter a command number:',
  '',
  '1: Refresh storage films.',
  '2: Toggle between desktop and mobile view.',
];

pageLoad().then(() => {
  const logoElement = $('.site-logo');

  logoElement.addEventListener('contextmenu', async (event) => {
    event.preventDefault();

    const commandNumber = prompt(commands.join('\n'), '');

    switch (commandNumber) {
      case '1': {
        await refresh();
        break;
      }

      case '2': {
        toggleView();
        break;
      }

      // eslint-disable-next-line unicorn/no-null
      case null: {
        break;
      }

      default: {
        alert('Invalid option!');
        break;
      }
    }
  });
}).catch(() => {});

if (GM?.registerMenuCommand !== undefined) {
  GM.registerMenuCommand('Refresh storage films', refresh);

  GM.registerMenuCommand('Check this film rating', async () => {
    const filmID = tabURL.split('/')[4];

    try {
      const filmsData = localStorage.getItem('my-films');
      const films = JSON.parse(filmsData!) as MyFilmsX;
      const [rating, name] = films[filmID!]!;

      alert(`${name}: ${rating}`);
    } catch {}
  });
}

// TODO Search my films by a word or two
// TODO Flush storage common films
