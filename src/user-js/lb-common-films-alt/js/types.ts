import Tippy from 'tippy.js';

export type Elements = NodeListOf<HTMLAnchorElement>;

export type ResolveGetElements = ((value: Elements) => void) | undefined;

export interface GetMyFilmsOpt {
  link: string,
  collector?: Film[],
}

export interface GetFilmsOpt extends GetMyFilmsOpt {
  myFilmsIDs: Set<string>,
}

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

export interface CreateTooltipOpt {
  commonFilms: Film[],
  myRatedFilms: MyRatedFilms,
  userFilmsLink: string,
}

export interface TooltipElements {
  container: HTMLDivElement,
  matchElement: HTMLAnchorElement,
  // totalElement: HTMLHeadingElement,
  listElement: HTMLDListElement,
}
