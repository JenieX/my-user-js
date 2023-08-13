const IMDB = {
  label: 'IMDb',
  template: 'https://www.imdb.com/title/%s/',
};

const TL = {
  label: 'TorrentLeech',
  template: 'https://www.torrentleech.org/torrents/browse/index/query/%s/orderby/size/order/desc',
};

const TG = {
  label: 'TorrentGalaxy',
  template: 'https://torrentgalaxy.to/torrents.php?search=%s&%3Bsort=size&%3Border=desc&sort=size&order=desc',
};

const templates = [IMDB, TL, TG];

export default templates;
