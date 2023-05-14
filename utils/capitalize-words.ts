function capitalizeWords(header: string): string {
  const words = header.split(' ');

  const capitalizedWords = words.map((word) => {
    const firstLetter = word.charAt(0).toUpperCase();
    const remainingLetters = word.slice(1);

    return firstLetter + remainingLetters;
  });

  return capitalizedWords.join(' ');
}

export default capitalizeWords;
