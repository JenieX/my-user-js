import { $ } from '@jeniex/utils/browser';

function getIdentifier(parent?: HTMLElement): string {
  const element = $<HTMLAnchorElement>('a[href^="http://www.imdb.com/title/"', parent);
  const id = element.href.split('/')[4]!;

  return id;
}

export default getIdentifier;
