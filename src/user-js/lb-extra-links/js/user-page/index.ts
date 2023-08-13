import modifyList from './modify-list';

function userPageHandler(): void {
  const { setAttribute } = Element.prototype;
  Element.prototype.setAttribute = setAttributeOverride;

  function setAttributeOverride(this: HTMLElement, name: string, value: string): void {
    if (name === 'class' && value === 'fm-film-page popup-menu-text -last') {
      const listElement = this.parentElement as HTMLUListElement;
      modifyList(listElement);
    }

    return setAttribute.call(this, name, value);
  }
}

export default userPageHandler;
