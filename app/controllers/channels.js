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
    params: { gameName, statusQuery }
  } = ctx;

  ctx.body = {
    channels: Object.keys(channelPool)
      .filter(channelId => channelPool[channelId].game === gameName)
      .filter(channelId => (statusQuery ? channelPool[channelId].status === statusQuery : true))
      .map(channelId => {
        const channel = channelPool[channelId];
        const { host, maxPlayers, status } = channel;
        return {
          channelId,
          players: channel.getPlayerNames(),
          host,
          status,
          maxPlayers
        };
      })
  };
};
