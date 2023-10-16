import { Cookies } from '../libraries';

/**
 * Toggles between the desktop and mobile view
 */
function toggleView(): void {
  const current = Cookies.get('useMobileSite');
  if (current === 'yes') {
    Cookies.set('useMobileSite', 'no');
  } else {
    Cookies.set('useMobileSite', 'yes');
  }

  window.location.reload();
}

export default toggleView;
