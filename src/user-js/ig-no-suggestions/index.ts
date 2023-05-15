import './js/override-open';
import './js/override-send';
import { PossibleTimeLineResponse } from './js/types';

/**
 * Overrides the JSON.parse method to filter out suggested posts from the timeline data
 */
const originalJSONParse = JSON.parse;
JSON.parse = (...args: Parameters<JSON['parse']>): any => {
  const dataJSON = originalJSONParse(...args) as PossibleTimeLineResponse | string;
  if (typeof dataJSON === 'string' || dataJSON.feed_items === undefined) {
    return dataJSON;
  }

  dataJSON.feed_items = dataJSON.feed_items.filter((item) => {
    if (item.explore_story !== undefined) {
      return false;
    }

    return true;
  });

  return dataJSON;
};
