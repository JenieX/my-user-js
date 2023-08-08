async function waitForCompleteLoad(): Promise<void> {
  if (document.readyState === 'complete') {
    return;
  }

  // eslint-disable-next-line consistent-return
  return new Promise((resolve) => {
    window.addEventListener('load', () => {
      resolve();
    });
  });
}

export default waitForCompleteLoad;
