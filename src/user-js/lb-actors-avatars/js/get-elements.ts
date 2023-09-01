import selectors from './selectors';
import { $, $$ } from '../../../helpers';
import { Elements } from './types';

function getElements(): Elements {
  try {
    $('#show-cast-overflow').click();
  } catch {}

  const actorsElements = $$<HTMLAnchorElement>(selectors.letterboxd.actor);

  return actorsElements;
}

export default getElements;
