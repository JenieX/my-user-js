import modifyList from './modify-list';

function userPageHandler(): void {
  const { setAttribute } = Element.prototype;
  let setAttributeOverride: Element['setAttribute'];

  // eslint-disable-next-line prefer-const
  setAttributeOverride = function override1(this: HTMLElement, name, value): void {
    // console.log(setAttributeOverride.name);

    if (name === 'class' && value === 'fm-film-page popup-menu-text -last') {
      const listElement = this.parentElement as HTMLUListElement;

      try {
        modifyList(listElement);
      } catch (exception) {
        console.error(exception);
      }
    }

    return setAttribute.call(this, name, value);
  };

  Element.prototype.setAttribute = setAttributeOverride;
}

export default userPageHandler;
