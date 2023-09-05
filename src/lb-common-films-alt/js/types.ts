import Tippy from 'tippy.js';

export type Elements = NodeListOf<HTMLAnchorElement>;

export type ResolveGetElements = ((value: Elements) => void) | undefined;

export type Films = Film[] & { totalFilms?: string };

export interface Film {
  title: string,
  id: string,
  rating?: number,
}

export interface GetMyFilmsOpt {
  link: string,
  collector?: Films,
}

export interface GetFilmsOpt extends GetMyFilmsOpt {
  myFilmsIDs: Set<string>,
}

export type ScriptWindow = Window & {
  tippy: typeof Tippy,
};

export type MyRatedFilms = Record<string, number>;

export type FilmClass = 'close' | 'great-match' | 'match' | 'off' | 'way-off';

export interface CreateTooltipOpt {
  commonFilms: Film[],
  myRatedFilms: MyRatedFilms,
  userFilmsLink: string,
  totalFilms: string,
}

export interface TooltipElements {
  container: HTMLDivElement,
  matchElement: HTMLAnchorElement,
  totalElement: HTMLHeadingElement,
  listElement: HTMLDListElement,
}
