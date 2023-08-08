function setSearchParam(key: string, value: string, fullURL?: string): string {
  const updatedURL: string[] = [];
  const { origin, pathname, search, hash } = new URL(fullURL ?? window.location.href);
  updatedURL.push(origin, pathname);

  const searchParams = new URLSearchParams(search);
  searchParams.set(key, value);
  updatedURL.push('?', searchParams.toString());

  if (hash !== '') {
    updatedURL.push(hash);
  }

  return updatedURL.join('');
}

export default setSearchParam;
