import { AddAvatarsOpt } from './types';

function addAvatars({ avatars, elements }: AddAvatarsOpt): void {
  const container = elements[0]?.parentElement;

  for (const element of [...elements].reverse()) {
    const avatarImage = avatars[element.textContent!];
    if (avatarImage !== undefined) {
      element.classList.add('actor-with-avatar');

      const actorName = element.textContent;
      element.firstChild!.remove();

      const characterName = element.dataset.originalTitle;
      element.dataset.originalTitle = `${actorName}  |  ${characterName}`;

      element.style.setProperty('background', `url('${avatarImage}')`);

      // Move element to the top.
      container!.prepend(element);
    }
  }
}

export default addAvatars;
