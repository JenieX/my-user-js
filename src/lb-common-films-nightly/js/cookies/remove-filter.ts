import { Cookies } from '../libraries';

/**
 * Removed the cookie that was added by *`addFilter`* function.
 */
function removeFilter(): void {
  Cookies.remove('filmFilter');
}

export default removeFilter;
