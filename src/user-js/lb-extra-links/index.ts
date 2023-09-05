import { tabURL } from '@jeniex/utils/browser';
import filmPageHandler from './js/film-page';
import userPageHandler from './js/user-page';

if (tabURL.startsWith('https://letterboxd.com/film/')) {
  filmPageHandler();
} else {
  userPageHandler();
}
