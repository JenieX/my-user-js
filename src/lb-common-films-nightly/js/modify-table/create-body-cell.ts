function createBodyCell(iconClass: string): HTMLTableCellElement {
  const element = document.createElement('td');
  element.classList.add('table-stats');

  const linkElement = document.createElement('a');
  linkElement.classList.add('has-icon', 'icon-16', iconClass);
  linkElement.href = '#';

  // TODO click listener that add cookie filter of common films and open page

  const iconElement = document.createElement('span');
  iconElement.classList.add('icon');

  const textElement = document.createTextNode('N/A');

  linkElement.append(iconElement);
  linkElement.append(textElement);

  element.append(linkElement);

  return element;
}

export default createBodyCell;
