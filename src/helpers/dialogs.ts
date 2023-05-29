function alert(message?: string): void {
  if (message === undefined) {
    window.alert(`[ ${GM.info.script.name} ]`);

    return;
  }

  window.alert(`[ ${GM.info.script.name} ]\n\n${message}`);
}

function confirm(message: string): boolean {
  return window.confirm(`[ ${GM.info.script.name} ]\n\n${message}`);
}

function prompt(message: string, _default?: string): string | null {
  return window.prompt(`[ ${GM.info.script.name} ]\n\n${message}`, _default);
}

export { alert, confirm, prompt };
