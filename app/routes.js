'use strict';

const Router = require('koa-router');
const miscController = require('./controllers/misc');
const channelsController = require('./controllers/channels');
const typerSHowdownController = require('./controllers/typerShowdown');

const routerCreator = channelPool => {
  const router = new Router();
  router.get('/', miscController.getApiInfo);
  router.get('/spec', miscController.getSwaggerSpec);
  router.get('/status', miscController.healthcheck);
  router.get('/reset', channelsController.resetChannels(channelPool));
  router.get('/channels', channelsController.getChannelsList(channelPool));
  router.get('/channels/clear/:channelId', channelsController.clearChannel(channelPool));
  router.get('/channels/:gameName', channelsController.getChannelsListByGame(channelPool));
  router.get('/typerShowdown/words/:count', typerSHowdownController.getRandomWords);
  return router;
};

module.exports = channelPool => routerCreator(channelPool);
