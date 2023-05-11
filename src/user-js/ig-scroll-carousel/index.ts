function getButton(element: HTMLElement, type: string): HTMLButtonElement | null {
  const selector = type === 'next' ? 'button[aria-label="Next"]' : 'button[aria-label="Go Back"]';

  return element.querySelector(selector);
}

let busy = false;

function clickButton(element: HTMLButtonElement): void {
  if (busy === false) {
    busy = true;
    setTimeout(() => { busy = false; }, 300);

    element.click();
  }
}

window.addEventListener('wheel', (event): void => {
  const { pathname } = window.location;
  if (!pathname.startsWith('/p/') && pathname !== '/') {
    return;
  }

  const { target } = event;
  if (target === null || !(target instanceof HTMLElement)) {
    return;
  }

  const carouselContainer = target.closest('ul._acay');
  if (carouselContainer === null) {
    return;
  }

  event.preventDefault();

  const buttonsParentElement = carouselContainer.closest('._aao_')! as HTMLDivElement;

  const scrollDirection = event.deltaY > 0 ? 'down' : 'up';
  if (scrollDirection === 'down') {
    const nextButton = getButton(buttonsParentElement, 'next');
    if (nextButton !== null) {
      clickButton(nextButton);
    }
  } else {
    const previousButton = getButton(buttonsParentElement, 'previous');
    if (previousButton !== null) {
      clickButton(previousButton);
    }
  }
}, { passive: false });
