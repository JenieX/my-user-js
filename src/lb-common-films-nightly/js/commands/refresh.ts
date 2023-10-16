import { alert } from '@jeniex/utils/browser';
import { MY_ACCOUNT } from '../constants';
import { MyFilmsX } from '../types';
import { fetchMyFilms } from '../fetch-films';
import { setFilms } from '../storage';

/** Refreshes the local stored data for my films */
async function refresh(): Promise<void> {
  // XXX Appending "by/name/" to avoid the glitch in Letterboxd that is listing
  // "nymphomaniac-volume-ii" as "nymphomaniac-volume-i" and have a duplicate.
  const myFilmsLink = `https://letterboxd.com/${MY_ACCOUNT}/films/by/name/`;

  const myFilms = await fetchMyFilms({ link: myFilmsLink });

  const map: MyFilmsX = {};

  for (const { id, rating, name } of myFilms) {
    // console.log(id);
    map[id] = [rating, name];
  }

  // console.log(myFilms);
  // console.log(map);

  setFilms(map);
  alert('Your local films data has been refreshed successfully!');
}

export default refresh;
