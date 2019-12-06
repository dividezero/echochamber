'use strict';

exports.getChannelsList = channelPool => ctx => {
  const data = {
    channels: Object.keys(channelPool)
  };

  ctx.body = data;
};
