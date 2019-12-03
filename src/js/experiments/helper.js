function permute(word) {
  var permutations = [];

  if (word.length == 1) return [word];
  if (word.length == 2) return [word, word[1]+word[0]];

  word.split('').forEach(function (chr, idx, arr) {
    var sub = [].concat(arr);
    sub.splice(idx, 1);
    permute(sub.join('')).forEach(function (perm) {
      permutations.push(chr+perm);
    });
  });

  return permutations;
}

export function chooseRandomWord(wordList) {
  var index = Math.floor(Math.random() * wordList.length);
  return wordList[index];
}

export function randomPermutation(word) {
  var permutations = permute(word);
  return chooseRandomWord(permutations);
}
