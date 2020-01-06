'use strict';

exports.resetChannels = channelPool => ctx => {
  channelPool.resetChannelPool();
  ctx.body = {
    success: true,
    message: 'All channels cleared'
  };
};

exports.clearChannel = channelPool => ctx => {
  const {
    params: { channelId }
  } = ctx;
  channelPool.clearChannel(channelId);
  ctx.body = {
    success: true,
    message: `${channelId} channel cleared`
  };
};

exports.getChannelsList = ({ channelPool }) => ctx => {
  ctx.body = {
    channels: Object.keys(channelPool)
  };
};

exports.getChannelsListByGame = ({ channelPool }) => ctx => {
  const {
    params: { gameName }
  } = ctx;

  ctx.body = {
    channels: Object.keys(channelPool)
      .filter(channelId => channelPool[channelId].game === gameName)
      .map(channelId => {
        const channel = channelPool[channelId];
        const { host, maxPlayers } = channel;
        return {
          channelId,
          players: channel.getPlayerNames(),
          host,
          maxPlayers
        };
      })
  };
};
