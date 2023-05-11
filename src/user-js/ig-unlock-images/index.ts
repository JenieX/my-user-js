function unlockImageContextMenu(article: HTMLElement): void {
  const emptyDiv = article.querySelector('._aagw');
  if (emptyDiv !== null) {
    emptyDiv.remove();
  }
}

const imgSourceSetter = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src')!.set!;
Object.defineProperty(HTMLImageElement.prototype, 'src', {
  set(this: HTMLImageElement, value: string) {
    imgSourceSetter.call(this, value);

    const article = this.closest('article, main') as HTMLElement | null;
    if (article === null) {
      return;
    }

    unlockImageContextMenu(article);
  },
});
