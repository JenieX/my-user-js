function addKeyListener(link: string): void {
  document.addEventListener('keyup', async ({ code: keyName }) => {
    if (keyName === 'KeyL') {
      window.location.href = link;
    }
  });
}

export default addKeyListener;
