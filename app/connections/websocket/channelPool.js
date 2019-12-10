const Channel = require('./channel');

class ChannelPool {
  constructor() {
    this.channelPool = {};
  }

  addConnectionToChannel(connection, channelId, game) {
    if (!this.channelPool[channelId]) {
      this.channelPool[channelId] = new Channel(channelId, game);
    }
    this.channelPool[channelId].addConnection(connection);
    return {
      success: true
    };
  }

  removeConnectionFromChannel(connectionId, channelId) {
    if (this.channelPool[channelId] && this.channelPool[channelId].hasConnection(connectionId)) {
      this.channelPool[channelId].removeConnection(connectionId);
      this._clearChannel(channelId);
    }
    return {
      success: true
    };
  }

  _clearChannel(channelId) {
    if (!Object.keys(this.channelPool[channelId]).length) {
      delete this.channelPool[channelId];
    }
  }

  broadcastToChannel(channelId, connId, message) {
    if (this.channelPool[channelId] && this.channelPool[channelId].hasConnection(connId)) {
      this.channelPool[channelId].broadcast(message);
    }
  }

  removeConnectionFromAllChannels(connectionId) {
    Object.keys(this.channelPool).forEach(channelId => {
      if (this.channelPool[channelId].hasConnection(connectionId)) {
        this.removeConnectionFromChannel(connectionId, channelId);
      }
    });
    return {
      success: true
    };
  }
}

module.exports = ChannelPool;
