function permuteWord(word) {
  const permutations = [];

  if (word.length == 1) return [word];
  if (word.length == 2) return [word, word[1] + word[0]];

  word.split('').forEach((character, _, array) => {
    const otherChars = array.filter(item => item != character);
    return permuteWord(otherChars.join('')).forEach(permutation => permutations.push(character + permutation));
  });
  
  return permutations;
}

export function chooseRandomElement(array) {
  var index = Math.floor(Math.random() * array.length);
  return array[index];
}

export function randomPermutation(word) {
  var permutations = permuteWord(word);
  return chooseRandomElement(permutations);
}

export function shuffleArray(array) {
  // https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array
}
