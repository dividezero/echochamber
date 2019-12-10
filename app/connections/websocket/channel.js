class Channel {
  constructor(channelId, game, host) {
    this.channelId = channelId;
    this.game = game;
    this.host = host;
    this.connectionList = [];
  }

  hasConnection(connId) {
    return !!this.connectionList[connId];
  }

  addConnection(conn) {
    const { id } = conn;
    this.connectionList[id] = conn;
  }

  removeConnection(connId) {
    delete this.connectionList[connId];
  }

  broadcast(message) {
    for (const connId in this.connectionList) {
      this.connectionList[connId].write(JSON.stringify(message));
    }
  }
}

module.exports = Channel;
