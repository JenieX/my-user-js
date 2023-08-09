import messages from './messages';
import { ScriptWindow } from './types';

const { tippy } = (window as unknown) as ScriptWindow;
tippy.setDefaultProps({
  allowHTML: true,
  placement: 'right',
  // maxWidth: 300,
  content: messages.loading,
});

export default tippy;
