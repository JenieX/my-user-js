import {
  EvalFilter,
  EvaluatedFilms,
  Film,
  FilmRating,
  Films,
} from './common';

export interface EvaluateFilmsOpt {
  commonFilms: Film[],
  sortByName: boolean,
  filter?: EvalFilter,
}

export interface CreateTooltipContentOpt {
  evaluatedFilms: EvaluatedFilms,
  user: string,
  totalFilms: string,
}

export interface GetFilmsOpt {
  link: string,
  collector?: Films,
}

export interface GetMyFilmsOpt {
  link: string,
  collector?: Film[],
}

export interface GetWatchlistFilmsOpt extends GetMyFilmsOpt {}

export interface GetMyWatchlistOpt {
  link: string,
  collector?: string[],
}

export interface MarkAsNotWatched {
  /** The id of the film. It is the identifier part of the link of that film page. */
  id: string,
}

export interface MarkAsWatched extends MarkAsNotWatched {
  /** The name of the film. */
  name: string,
}

export interface RateOpt extends MarkAsWatched {
  /** The rating of the film. */
  rating: FilmRating,
}

// eslint-disable-next-line @typescript-eslint/ban-types
// type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & {};

export interface SetContentOpt extends Pick<EvaluatedFilms, 'common' | 'match'> {
  rowElement: HTMLTableRowElement,
}

// type Test = Simplify<SetContentOpt>;
