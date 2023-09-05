import templates from './templates';
import { CreateItemOpt } from './types';

function createItem({ label, template, replacement, className }: CreateItemOpt): HTMLLIElement {
  const element = document.createElement('li');
  const child = document.createElement('a');

  if (template === undefined) {
    child.setAttribute('href', '#');
  } else {
    child.setAttribute('href', template.replace('%s', replacement!));
    child.setAttribute('target', '_blank');
  }

  child.textContent = label;

  if (className !== undefined) {
    element.setAttribute('class', className);
  }

  element.append(child);

  return element;
}

function createItems(imdbID: string, className?: string): HTMLLIElement[] {
  const elements: HTMLLIElement[] = [];

  let finalTemplates = templates;

  /**
 * Remove the first item that is `imdb`, if on a film page. And as it happened, items
 * in there do not require a class name.
 */
  if (className === undefined) {
    finalTemplates = templates.slice(1);
  }

  for (const { label, template } of finalTemplates) {
    const element = createItem({
      label,
      template,
      replacement: imdbID,
      className,
    });

    elements.push(element);
  }

  return elements;
}

export { createItem };
export default createItems;
