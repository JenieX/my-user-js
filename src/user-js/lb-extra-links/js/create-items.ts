import templates from './templates';
import { CreateItemOpt } from './types';

function createItem({ label, template, imdbID, className }: CreateItemOpt): HTMLLIElement {
  const element = document.createElement('li');
  const child = document.createElement('a');

  if (template === undefined) {
    child.setAttribute('href', '#');
  } else {
    child.setAttribute('href', template.replace('%s', imdbID!));
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
  if (className === undefined) {
    finalTemplates = templates.slice(1);
  }

  for (const { label, template } of finalTemplates) {
    const element = createItem({
      label,
      template,
      imdbID,
      className,
    });

    elements.push(element);
  }

  return elements;
}

export { createItem };
export default createItems;
