import Tippy from 'tippy.js';

export type ScriptWindow = Window & {
  tippy: typeof Tippy,
};

export interface Film {
  title: string,
  id: string,
  rating?: number,
}

export type MyRatedFilms = Record<string, number>;

export type FilmClassName = 'close' | 'match' | 'off' | 'prefect-match' | 'way-off';
