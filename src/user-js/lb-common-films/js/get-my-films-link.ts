import { $ } from '../../../helpers';

function getMyFilmsLink(): string {
  return $<HTMLAnchorElement>('.main-nav .subnav a[href$="/films/"]').href;
}

export default getMyFilmsLink;
