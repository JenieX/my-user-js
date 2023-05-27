let busy = false;

function isBrokenImage(img: HTMLImageElement): boolean {
  return img.naturalWidth === 0 && img.naturalHeight === 0;
}

function isHiddenImage(img: HTMLImageElement): boolean {
  const isHidden = img.style.getPropertyValue('display') === 'none';
  const isParentHidden = img.parentElement!.style.getPropertyValue('display') === 'none';

  return isHidden || isParentHidden;
}

async function reloadImage(img: HTMLImageElement): Promise<void> {
  return new Promise((resolve) => {
    img.removeAttribute('loading');

    const doneCallback = (): void => {
      img.removeEventListener('load', doneCallback);
      img.removeEventListener('error', doneCallback);

      resolve();
    };

    img.addEventListener('load', doneCallback);
    img.addEventListener('error', doneCallback);

    img.setAttribute('src', img.src);
  });
}

async function main(): Promise<void> {
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
    return img.src !== '' && isBrokenImage(img) && !isHiddenImage(img);
  });

  if (brokenImgs.length === 0) {
    alert('No broken images found!');
    busy = false;

    return;
  }

  if (!window.confirm(`Found ${brokenImgs.length} broken images, reload all?`)) {
    busy = false;

    return;
  }

  for (const img of brokenImgs) {
    await reloadImage(img);
  }

  alert('Done reloading! \n\nRepeat the process if some images are still broken.');

  busy = false;
}

GM.registerMenuCommand('Reload broken images', main);

export {};
