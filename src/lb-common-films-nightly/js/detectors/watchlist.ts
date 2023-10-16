async function addToWatchlist(filmID: string): Promise<void> {
  const WatchlistData = await GM.getValue('watchlist');

  if (WatchlistData === undefined) {
    await GM.setValue('watchlist', JSON.stringify([filmID]));

    return;
  }

  const watchlist = JSON.parse(WatchlistData as string) as string[];
  if (watchlist.includes(filmID)) {
    return;
  }

  watchlist.push(filmID);

  await GM.setValue('watchlist', JSON.stringify(watchlist));
}

async function removeFromWatchlist(filmID: string): Promise<void> {
  const WatchlistData = await GM.getValue('watchlist');

  if (WatchlistData === undefined) {
    return;
  }

  const watchlist = JSON.parse(WatchlistData as string) as string[];

  if (!watchlist.includes(filmID)) {
    return;
  }

  const index = watchlist.indexOf(filmID);
  watchlist.splice(index, 1);

  await GM.setValue('watchlist', JSON.stringify(watchlist));
}

export { addToWatchlist, removeFromWatchlist };
