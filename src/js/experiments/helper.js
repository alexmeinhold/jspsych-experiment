function permuteWord(word) {
  // https://gist.github.com/customcommander/e9af9da584ff3a33f5ed
  const permutations = [];

  if (word.length == 1) return [word];
  if (word.length == 2) return [word, word[1] + word[0]];

  word.split('').forEach((character, index, array) => {
    const otherChars = [...array];
    otherChars.splice(index, 1);
    return permuteWord(otherChars.join(''))
        .forEach(permutation => permutations.push(character + permutation));
  });

  return permutations;
}

export function chooseRandomElement(array) {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

export function randomPermutation(word) {
  const permutations = permuteWord(word);
  let randomWord;
  do {
    randomWord = chooseRandomElement(permutations);
  } while (hammingDistance(word, randomWord) < 3);
  return randomWord;
}

export function shuffleArray(array) {
  // https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function hammingDistance(firstWord, secondWord) {
  // lets assume both words have the same length
  let index = 0;
  let distance = 0;

  while (index < firstWord.length && index < secondWord.length) {
    if (firstWord[index] !== secondWord[index]) distance++;
    index++;
  }

  return distance;
}
