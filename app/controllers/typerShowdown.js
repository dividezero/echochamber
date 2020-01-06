'use strict';

const randomWords = require('../utils/randomWords');

exports.getRandomWords = ctx => {
  const {
    params: { count }
  } = ctx;
  ctx.body = randomWords.getRandomWord(count);
};
