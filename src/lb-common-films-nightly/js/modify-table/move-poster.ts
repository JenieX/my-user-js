import { $ } from '@jeniex/utils/browser';

function movePoster(): void {
  const element = $('.sidebar:not(#find-friends)');

  element.closest('#content')!.prepend(element);
}

export default movePoster;
