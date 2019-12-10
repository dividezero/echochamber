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
    channels: Object.keys(
      channelPool
        .filter(({ game }) => game === gameName)
        .map(({ channelId, game, players, connectionList }) => ({
          channelId,
          game,
          players,
          numPlayers: connectionList.length
        }))
    )
  };
};
