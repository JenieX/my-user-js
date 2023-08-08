function getSearchParam(key: string, fullURL?: string): string | undefined {
  const { search } = new URL(fullURL ?? window.location.href);
  const searchParams = new URLSearchParams(search);
  const value = searchParams.get(key);
  if (value === null) {
    return undefined;
  }

  return value;
}

export default getSearchParam;
