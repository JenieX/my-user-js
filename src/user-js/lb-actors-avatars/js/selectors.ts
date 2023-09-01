const selectors = {
  imdb: {
    avatar: 'section[cel_widget_id="StaticFeature_Cast"] img.ipc-image',
  },
  letterboxd: {
    actor: '#tab-cast a[href^="/actor/contributor:"',
    imdb: 'a[href*="www.imdb.com/title/"]',
  },
};

export default selectors;
