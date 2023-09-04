function addKeyListener(link: string): void {
  let setTimeoutRef: NodeJS.Timeout | undefined;

  document.addEventListener('keyup', async ({ code: keyName }) => {
    if (keyName === 'KeyL') {
      if (setTimeoutRef !== undefined) {
        clearTimeout(setTimeoutRef);
        setTimeoutRef = undefined;

        window.open(link);

        return;
      }

      setTimeoutRef = setTimeout(() => {
        setTimeoutRef = undefined;

        window.location.href = link;
      }, 500);
    }
  });
}

export default addKeyListener;
