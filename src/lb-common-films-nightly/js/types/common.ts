/** Films possible rating values. Zero means only watched and not really rated */
export type FilmRating = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface Film {
  name: string,
  id: string,
  rating: FilmRating,
  watchlisted?: true,
}

export type Films = Film[] & { totalFilms?: string };

// export type MyFilms = Record<string, FilmRating>;

export type MyFilmsX = Record<string, [FilmRating, string]>;

/** My films in the storage */
// export interface StorageFilms {
//   [key: string]: number | [FilmRating, string],
//   expires: number,
// }

/** My films in the storage */
// export type StorageFilms = MyFilmsX & { expires: number };

// eslint-disable-next-line @typescript-eslint/ban-types
// type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & {};
// type Test = Simplify<StorageFilms>;

export type FilmPoints = 0 | 1 | 2 | 3 | 4;

export type EvalFilter = FilmPoints | 'not-rated' | 'watchlisted';

type FilmLabel = 'close' | 'great-match' | 'match' | 'not-rated' | 'off' | 'watchlisted' | 'way-off';

export interface EvaluatedFilm extends Omit<Film, 'watchlisted'> {
  label: FilmLabel,
  myRating?: FilmRating,
}

export type EvaluatedFilms = EvaluatedFilm[] & {
  /** The similarity percentage between you and that user. */
  match: number,

  /** Number of films that are common between you and that user. */
  common: number,
};

export interface StorageCommonFilms {
  films: Film[],
  total: string,
  expires: number,
}

export interface DetectedResponse {
  result: boolean,
  rating?: FilmRating,
  film: { name: string },
}
