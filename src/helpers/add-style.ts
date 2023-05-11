function addStyle(css: string, parent = document.documentElement): HTMLStyleElement {
  const style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.textContent = css;
  parent.append(style);

  return style;
}

export default addStyle;
