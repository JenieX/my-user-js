import { RateOpt } from '../types';
import { getFilms, setFilms } from '../storage';

async function rate({ id, rating, name }: RateOpt): Promise<void> {
  const myFilms = getFilms();

  if (myFilms === undefined) {
    setFilms({ [id]: [rating, name] });

    return;
  }

  myFilms[id] = [rating, name];

  setFilms(myFilms);
}

export default rate;
