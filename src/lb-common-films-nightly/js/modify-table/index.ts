import { addStyle, pageLoad } from '@jeniex/utils/browser';
import addBodyCells from './add-body-cells';
import addHeaderCells from './add-header-cells';
// import movePoster from './move-poster';
import prepareContent from './prepare-content';

// https://github.com/jhuet/jquery-jnotify

// setTimeout(() => {
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-call
//   $.jnotify('This is a sweet success message!', 'success');
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-call
//   $.jnotify('This is an error message!', 'error');
// }, 3000);

async function modifyTable(): Promise<void> {
  addStyle('include-file: table.min.css');
  await pageLoad();

  addHeaderCells();
  addBodyCells();

  try {
    // movePoster();
  } catch {}

  prepareContent();
}

export { default as setContent } from './set-content';

export default modifyTable;

// TODO Backup followers
// TODO Search films in view
// TODO Show Letterboxd rating on IMDb > save to session storage and re-use
// in trailer page and others
// TODO use while loop instead of recursion
// TODO lb-make-backup
// TODO Hack notification and tooltip functions

// mpv subtitle not showing for few seconds after jumping backward

// ------------------------------------------------

// const script = document.createElement('script');
// script.src = 'https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/dist/js.cookie.js';
// document.body.append(script);

// const script = document.createElement('script');
// script.type = 'module';

// script.textContent = `
// import 'http://192.168.1.39:1011/lb-common-films-nightly';
// // import 'https://unpkg.com/@popperjs/core@2.11.8/dist/umd/popper.js';
// // import 'https://unpkg.com/tippy.js@6.3.7/dist/tippy-bundle.umd.js';
// // import 'https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/dist/js.cookie.js';
// // console.log(Cookies);
// `;

// document.body.append(script);
