function unlockImageContextMenu(parent: HTMLDivElement): void {
  const emptyDiv = parent.querySelector('._aagw');
  if (emptyDiv !== null) {
    emptyDiv.remove();
  }
}

const imgSourceSetter = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src')!.set!;
Object.defineProperty(HTMLImageElement.prototype, 'src', {
  set(this: HTMLImageElement, value: string) {
    imgSourceSetter.call(this, value);

    const hasLink = this.closest('a') !== null;
    if (hasLink) {
      return;
    }

    const emptyDivParent = this.closest('._aagu') as HTMLDivElement | null;
    if (emptyDivParent === null) {
      return;
    }

    unlockImageContextMenu(emptyDivParent);
  },
});
