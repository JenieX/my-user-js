import { addStyle } from '../../helpers';

const splashScreenFrame = document.createElement('iframe');
splashScreenFrame.setAttribute('id', 'ig-splash-screen');
document.documentElement.append(splashScreenFrame);

addStyle('include-file: splash-screen.min.css', splashScreenFrame.contentDocument!.head);

splashScreenFrame.contentDocument!.body.insertAdjacentHTML('beforeend', 'include-file: icon.html');

const mainStyle = addStyle('include-file: style.min.css');

function detectSplashScreen(mutations: MutationRecord[], observer: MutationObserver): void {
  for (const { target } of mutations) {
    if (
      target.nodeType === Node.ELEMENT_NODE &&
      target instanceof HTMLDivElement &&
      target.matches('#splash-screen') &&
      target.style.getPropertyValue('display') === 'none'
    ) {
      observer.disconnect();

      splashScreenFrame.remove();
      mainStyle.remove();

      return;
    }
  }
}

new MutationObserver(detectSplashScreen).observe(document, {
  attributeFilter: ['style'],
  subtree: true,
});
