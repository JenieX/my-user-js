import { $, $$, fishX } from '@jeniex/utils/browser';
import selectors from './selectors';
import { Avatars } from './types';

async function fetchAvatars(): Promise<Record<string, string>> {
  const imdbLink = $<HTMLAnchorElement>(selectors.letterboxd.imdb).href;

  const documentX = await fishX.document(imdbLink);
  const avatarsElements = $$<HTMLImageElement>(selectors.imdb.avatar, documentX.body);

  const map: Avatars = {};

  for (const { alt: name, src } of avatarsElements) {
    map[name] = src;
  }

  return map;
}

export default fetchAvatars;
