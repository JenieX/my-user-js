function $<T = HTMLElement>(selector: string, parent?: Element): T {
  const element = (parent ?? document).querySelector(selector);
  if (element === null) {
    throw new Error(`Couldn't find the element with the selector ${selector}`);
  }

  return element as T;
}

function $$<T = NodeListOf<HTMLElement>>(selector: string, parent?: Element): T {
  const elements = (parent ?? document).querySelectorAll(selector);
  if (elements.length === 0) {
    throw new Error(`Couldn't find any element with the selector ${selector}`);
  }

  return elements as T;
}

export { $, $$ };
