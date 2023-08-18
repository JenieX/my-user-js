const IMDB = {
  label: 'IMDb',
  template: 'https://www.imdb.com/title/%s/',
};

const TL = {
  label: 'Search TL',
  template: 'https://www.torrentleech.org/torrents/browse/index/query/%s/orderby/size/order/desc',
};

const TG = {
  label: 'Search TG',
  template: 'https://torrentgalaxy.to/torrents.php?search=%s&%3Bsort=size&%3Border=desc&sort=size&order=desc',
};

const templates = [IMDB, TL, TG];

export default templates;
