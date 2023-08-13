import filmPageHandler from './js/film-page';
import userPageHandler from './js/user-page';
import { TAB_URL } from '../../helpers';

if (TAB_URL.startsWith('https://letterboxd.com/film/')) {
  filmPageHandler();
} else {
  userPageHandler();
}
