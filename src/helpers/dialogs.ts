import { SCRIPT_NAME } from './constants';

function alert(message?: string): void {
  if (message === undefined) {
    window.alert(`[ ${SCRIPT_NAME} ]`);

    return;
  }

  window.alert(`[ ${SCRIPT_NAME} ]\n\n${message}`);
}

function confirm(message: string): boolean {
  return window.confirm(`[ ${SCRIPT_NAME} ]\n\n${message}`);
}

function prompt(message: string, _default?: string): string | null {
  return window.prompt(`[ ${SCRIPT_NAME} ]\n\n${message}`, _default);
}

export { alert, confirm, prompt };
