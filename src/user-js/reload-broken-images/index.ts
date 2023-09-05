import { imageLoad, logId, alert, confirm } from '@jeniex/utils/browser';

let busy = false;

function isBrokenImage(img: HTMLImageElement): boolean {
  return img.naturalWidth === 0 && img.naturalHeight === 0;
}

function isHiddenImage(img: HTMLImageElement): boolean {
  const isHidden = img.style.getPropertyValue('display') === 'none';
  const isParentHidden = img.parentElement!.style.getPropertyValue('display') === 'none';

  return isHidden || isParentHidden;
}

async function reloadBrokenImages(): Promise<void> {
  if (document.readyState !== 'complete') {
    alert('The page is not fully loaded yet!');

    return;
  }

  if (busy === true) {
    alert('There is already a previous command in progress..');

    return;
  }

  busy = true;
  const imgs = document.querySelectorAll('img') as NodeListOf<HTMLImageElement>;

  const brokenImgs = [...imgs].filter((img) => {
    const hasSource = img.getAttribute('src') !== null && img.getAttribute('src') !== '';

    return hasSource && isBrokenImage(img) && !isHiddenImage(img);
  });

  if (brokenImgs.length === 0) {
    alert('No broken images found!');
    busy = false;

    return;
  }

  if (!confirm(`Found ${brokenImgs.length} broken images, reload all?`)) {
    busy = false;

    return;
  }

  /** Still broken images counter */
  let counter = 0;

  for (const img of brokenImgs) {
    img.removeAttribute('loading');
    img.setAttribute('src', img.src);

    try {
      await imageLoad(img);
    } catch {
      counter += 1;
      console.error(logId, `Couldn't reload: ${img.src}`);
    }
  }

  if (counter === 0) {
    alert('All broken images have been successfully reloaded.');
  } else {
    alert(`Couldn't reload ${counter} images. Try repeating the process if necessary.`);
  }

  busy = false;
}

GM.registerMenuCommand('Reload broken images', reloadBrokenImages);
