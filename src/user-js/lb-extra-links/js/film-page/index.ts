import rebuildContent from './rebuild-content';

function filmPageHandler(): void {
  const innerHTMLSetter = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML')!.set!;

  Object.defineProperty(Element.prototype, 'innerHTML', {
    set(this: Element, value: string) {
      if (value.includes('PATRON')) {
        const updatedValue = rebuildContent(value.replace('PATRON', 'LOL'));

        innerHTMLSetter.call(this, updatedValue);

        return;
      }

      innerHTMLSetter.call(this, value);
    },
  });
}

export default filmPageHandler;
