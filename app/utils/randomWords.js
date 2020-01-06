const fs = require('fs');
const wordListPath = require('word-list');

exports.getAllWords = () => fs.readFileSync(wordListPath, 'utf8').split('\n');

exports.getRandomWord = count => {
  const words = exports.getAllWords();
  const result = [];
  for (let i = 0; i < count; i++) {
    const index = Math.round(Math.random() * words.length);
    result.push(words[index]);
  }
  return result;
};
