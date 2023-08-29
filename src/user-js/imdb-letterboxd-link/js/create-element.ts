function createElement(link: string): void {
  const divElement = document.createElement('div');
  divElement.id = 'imdb-letterboxd-link';

  const aElement = document.createElement('a');
  aElement.setAttribute('href', link);
  aElement.setAttribute('class', 'imdb-letterboxd-logo');
  aElement.setAttribute('target', '_blank');

  divElement.append(aElement);
  document.documentElement.append(divElement);
}

export default createElement;
