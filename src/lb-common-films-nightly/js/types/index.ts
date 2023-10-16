export type {
  DetectedResponse,
  EvalFilter,
  EvaluatedFilm,
  Film,
  FilmPoints,
  FilmRating,
  Films,
  // MyFilms,
  MyFilmsX,
  StorageCommonFilms,
  EvaluatedFilms,
} from './common';

export type {
  CreateTooltipContentOpt,
  EvaluateFilmsOpt,
  GetFilmsOpt,
  GetMyFilmsOpt,
  GetMyWatchlistOpt,
  GetWatchlistFilmsOpt,
  MarkAsNotWatched,
  MarkAsWatched,
  RateOpt,
  SetContentOpt,
} from './options';

export type {
  ScriptWindow,
  State,
  TippyInstance,
} from './global';

// ------------------------------------------------

export type Elements = NodeListOf<HTMLAnchorElement>;

export type ResolveGetElements = ((value: Elements) => void) | undefined;

export type FilmClass = 'close' | 'great-match' | 'match' | 'off' | 'way-off';

export interface TooltipElements {
  container: HTMLDivElement,
  matchElement: HTMLAnchorElement,
  totalElement: HTMLHeadingElement,
  listElement: HTMLDListElement,
}
