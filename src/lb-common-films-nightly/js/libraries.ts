import messages from './messages';
import { ScriptWindow } from './types';

const win = (window as unknown) as ScriptWindow;
const winX = (unsafeWindow as unknown) as ScriptWindow;

const tippy = win.tippy ?? winX.tippy;
const Cookies = win.Cookies ?? winX.Cookies;

// @ts-expect-error
unsafeWindow.Cookies = Cookies;

tippy.setDefaultProps({
  appendTo: document.documentElement,
  allowHTML: true,
  placement: 'right',
  maxWidth: 'none',
  content: messages.loading,
});

export { tippy, Cookies };
