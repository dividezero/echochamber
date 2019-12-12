'use strict';

const Koa = require('koa');
const sockjs = require('sockjs');
const logging = require('@kasa/koa-logging');
const requestId = require('@kasa/koa-request-id');
const apmMiddleware = require('./middlewares/apm');
const bodyParser = require('./middlewares/body-parser');
const cors = require('./middlewares/cors');
const errorHandler = require('./middlewares/error-handler');
const corsConfig = require('./config/cors');
const logger = require('./logger');
const routerCreator = require('./routes');
const ChannelPool = require('./connections/websocket/channelPool');

const { getErrorMessage } = require('./messages/general');

class App extends Koa {
  constructor(...params) {
    super(...params);

    // Trust proxy
    this.proxy = true;
    // Disable `console.errors` except development env
    this.silent = this.env !== 'development';

    this.servers = [];
    this.channelPool = new ChannelPool();

    this._configureMiddlewares();
    this._configureRoutes();
  }

  _configureMiddlewares() {
    this.use(errorHandler());
    this.use(apmMiddleware());
    this.use(requestId());
    this.use(
      logging({
        logger,
        overrideSerializers: false
      })
    );
    this.use(
      bodyParser({
        enableTypes: ['json'],
        jsonLimit: '10mb'
      })
    );
    this.use(
      cors({
        origins: corsConfig.origins,
        allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
        allowHeaders: ['Content-Type', 'Authorization'],
        exposeHeaders: ['Content-Length', 'Date', 'X-Request-Id']
      })
    );
  }

  _configureRoutes() {
    // Bootstrap application router
    const router = routerCreator(this.channelPool);
    this.use(router.routes());
    this.use(router.allowedMethods());
  }

  getWebsocket() {
    const websocket = sockjs.createServer({
      sockjs_url: 'http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js'
    });
    websocket.on('connection', conn => {
      const { id: connectionId } = conn;
      conn.on('data', strMessage => {
        const message = JSON.parse(strMessage);
        console.log(strMessage);
        const { action, channelId, username, channelOpts } = message;
        try {
          switch (action) {
            case 'CHANNEL_CREATE':
              console.log(`creating and joining channel ${channelId}`);
              this.channelPool.createChannel(conn, channelId, channelOpts, username);
              break;
            case 'CHANNEL_JOIN':
              console.log(`joining channel ${channelId}`);
              this.channelPool.addConnectionToChannel(conn, channelId, username);
              break;
            case 'CHANNEL_LEAVE':
              this.channelPool.removeConnectionFromChannel(connectionId, channelId);
              break;
            default:
              console.log(`broadcasting to ${channelId}`);
              this.channelPool.broadcastToChannel(channelId, connectionId, message);
              break;
          }
        } catch (e) {
          console.error('Error', e);
          conn.write(JSON.stringify(getErrorMessage(e.message)));
        }
      });
      conn.on('close', () => {
        this.channelPool.removeConnectionFromAllChannels(connectionId);
      });
    });
    return websocket;
  }

  listen(...args) {
    const server = super.listen(...args);
    this.getWebsocket().installHandlers(server, { prefix: '/websocket' });
    this.servers.push(server);
    return server;
  }

  async terminate() {
    // TODO: Implement graceful shutdown with pending request counter
    for (const server of this.servers) {
      server.close();
    }
  }
}

module.exports = App;
