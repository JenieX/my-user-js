async function waitForPageLoad(): Promise<void> {
  if (document.readyState === 'complete') {
    return;
  }

  // eslint-disable-next-line consistent-return
  return new Promise((resolve) => {
    document.addEventListener('DOMContentLoaded', () => {
      resolve();
    });
  });
}

export default waitForPageLoad;
