const Channel = require('./channel');
const { getDisconnectMessage, getUserConnectMessage } = require('../../messages/general');

class ChannelPool {
  constructor() {
    this.channelPool = {};
  }

  addConnectionToChannel(connection, channelId, username) {
    if (!this.channelPool[channelId]) {
      throw new Error('Channel doesnt exists');
    }
    this.channelPool[channelId].addConnection(connection, username);
    this.channelPool[channelId].broadcast(getUserConnectMessage(channelId, username));
  }

  createChannel(connection, channelId, channelOpts, username) {
    if (this.channelPool[channelId]) {
      throw new Error('Channel already exists');
    }
    this.channelPool[channelId] = new Channel(channelId, { ...channelOpts, host: username });
    this.channelPool[channelId].addConnection(connection, username);
  }

  removeConnectionFromChannel(connectionId, channelId) {
    const channel = this.channelPool[channelId];
    if (channel && channel.hasConnection(connectionId)) {
      const username = channel.getUsername(connectionId);
      if (username) {
        channel.broadcast(getDisconnectMessage(channelId, username));
      }
      channel.removeConnection(connectionId);
      this._clearChannel(channelId);
    }
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
  }
}

module.exports = ChannelPool;
