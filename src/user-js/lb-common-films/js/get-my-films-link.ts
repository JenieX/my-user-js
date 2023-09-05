import { $ } from '@jeniex/utils/browser';

function getMyFilmsLink(): string {
  const selectors = [
    '.main-nav .subnav a[href$="/films/"]',
    '#mobile-nav .subnav a[href$="/films/"]',
  ];

  return $<HTMLAnchorElement>(selectors.join(',')).href;
}

export default getMyFilmsLink;
