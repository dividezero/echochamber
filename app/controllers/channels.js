'use strict';

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
