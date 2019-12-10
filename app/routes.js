'use strict';

const Router = require('koa-router');
const miscController = require('./controllers/misc');
const channelsController = require('./controllers/channels');

const routerCreator = channelPool => {
  const router = new Router();
  router.get('/', miscController.getApiInfo);
  router.get('/spec', miscController.getSwaggerSpec);
  router.get('/status', miscController.healthcheck);
  router.get('/channels', channelsController.getChannelsList(channelPool));
  router.get('/channels/:gameName', channelsController.getChannelsList(channelPool));
  return router;
};

module.exports = channelPool => routerCreator(channelPool);
