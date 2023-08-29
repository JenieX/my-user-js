async function createElement(link: string): Promise<void> {
  const divElement = document.createElement('div');
  divElement.id = 'imdb-letterboxd-link';

  const aElement = document.createElement('a');
  aElement.setAttribute('href', link);
  aElement.setAttribute('class', 'imdb-letterboxd-logo');
  aElement.setAttribute('target', '_blank');

  const blobURL = await GM.getResourceUrl('letterboxdLogo');

  if (blobURL === undefined || blobURL === '') {
    throw new Error('There was an error loading the Letterboxd logo.');
  }

  aElement.style.setProperty('background', `url('${blobURL}')`);
  aElement.style.setProperty('background-position', '0 -800px');
  aElement.style.setProperty('background-size', '800px 1020px');

  divElement.append(aElement);
  document.documentElement.append(divElement);
}

export default createElement;
