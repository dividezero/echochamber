const Channel = require('./channel');
const { getDisconnectMessage, getUserConnectMessage } = require('../../messages/general');

class ChannelPool {
  constructor() {
    this.channelPool = {};
  }

  resetChannelPool() {
    Object.keys(this.channelPool).forEach(channelId => {
      this.channelPool[channelId].removeAllConnections();
      this.clearChannel(channelId);
    });
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
      const { connections } = channel;
      console.log(`length of ${channelId}`, connections.length);
      console.log('channelConns', connections);
      if (!connections.length) {
        this.clearChannel(channelId);
      }
    }
  }

  updateChannelStatus(connectionId, channelId, status) {
    const channel = this.channelPool[channelId];
    if (channel.host !== channel.getUsername(connectionId)) {
      throw new Error('User is not channel host');
    }
    channel.status = status;
  }

  clearChannel(channelId) {
    delete this.channelPool[channelId];
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
