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

export function chooseRandomWord(wordList) {
  var index = Math.floor(Math.random() * wordList.length);
  return wordList[index];
}

export function randomPermutation(word) {
  var permutations = permuteWord(word);
  return chooseRandomWord(permutations);
}
