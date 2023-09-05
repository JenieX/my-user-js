import { addStyle } from '@jeniex/utils/browser';
import { AddEventListenerArgs } from './types';

addStyle('include-file: style.min.css');

const originalAddEventListener = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = overrideAddEventListener;

function overrideAddEventListener(this: EventTarget, ...args: AddEventListenerArgs): void {
  const [eventName, callback, capture] = args;

  if (eventName === 'mouseup' && callback instanceof Function) {
    const override: EventListener = (event) => {
      const { target } = event;
      if (target instanceof HTMLTextAreaElement && target.matches('#read-only-cursor-text-area')) {
        return;
      }

      callback(event);
    };

    originalAddEventListener.call(this, eventName, override, capture);

    return;
  }

  originalAddEventListener.call(this, ...args);
}
