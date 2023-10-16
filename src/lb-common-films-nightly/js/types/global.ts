import Tippy, { Instance } from 'tippy.js';
import { EvalFilter } from './common';

interface Cookies {
  set: (name: string, value: string) => void,
  get: {
    (name: string): string | undefined,
    (): Record<string, string>,
  },
  remove: (name: string) => void,
}

export type ScriptWindow = Window & {
  tippy: typeof Tippy,
  Cookies: Cookies,
};

export interface TippyInstance extends Instance {
  /** The data property to be stored in the Tippy instances */
  options: {
    sort?: 'film-name' | 'user-rating',
  },
}

export interface State {
  tippyInstances: Record<string, TippyInstance>,
  lasRunFilter?: EvalFilter,
}
