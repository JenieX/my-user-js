async function waitForImageLoad(img: HTMLImageElement): Promise<void> {
  if (img.complete) {
    return;
  }

  // eslint-disable-next-line consistent-return
  return new Promise<void>((resolve, reject) => {
    let onLoad: () => void;
    let onError: () => void;

    const removeListeners = (): void => {
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onError);
    };

    onLoad = (): void => {
      removeListeners();
      resolve();
    };

    onError = (): void => {
      removeListeners();
      reject(new Error('Image failed to load'));
    };

    img.addEventListener('load', onLoad);
    img.addEventListener('error', onError);
  });
}

export default waitForImageLoad;
