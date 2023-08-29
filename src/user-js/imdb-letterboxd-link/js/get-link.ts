import { fishXResponse } from '../../../helpers';

async function fetchLink(imdbIdentifier: string): Promise<string> {
  const linkInStorage = sessionStorage.getItem(imdbIdentifier);

  if (linkInStorage !== null) {
    return linkInStorage;
  }

  const url = `https://letterboxd.com/imdb/${imdbIdentifier}/`;
  const response = await fishXResponse(url);

  if (response.url === url) {
    throw new Error(`No-one has added "${imdbIdentifier}" yet.`);
  }

  sessionStorage.setItem(imdbIdentifier, response.url);

  return response.url;
}

export default fetchLink;
