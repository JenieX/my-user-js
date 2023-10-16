import { Cookies } from '../libraries';

/**
 * Adds cookie that only lists films that you have watched.
 */
function addFilter(type: string): void {
  Cookies.set('filmFilter', type);
}

export default addFilter;
