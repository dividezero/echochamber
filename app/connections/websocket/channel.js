/**
 * Channel class to manage channel connections
 *  - channels can have 2 types of connections. Players(has username) and subscribers
 *  - Players count towards maxPlayers, subscribers dont
 */
class Channel {
  constructor(channelId, { game, host, maxPlayers }) {
    this.channelId = channelId;
    this.game = game;
    this.host = host;
    this.maxPlayers = maxPlayers;
    this.connections = {};
  }

  hasConnection(connId) {
    return !!this.connections[connId];
  }

  addConnection(connection, username) {
    const { id: connId } = connection;
    if (username && this.userInChannel(username)) {
      throw new Error('User already exists in channel');
    }
    if (this.maxPlayers && this.maxPlayers <= Object.keys(this.getPlayerConnections()).length) {
      throw new Error('Channel is full');
    }
    this.connections[connId] = {
      connection,
      username
    };
  }

  getUsername(connId) {
    return this.connections[connId].username;
  }

  removeConnection(connId) {
    delete this.connections[connId];
  }

  getPlayerNames() {
    return Object.keys(this.connections).reduce((acc, connId) => {
      const connection = this.connections[connId];
      const { username } = connection;
      return username ? [...acc, username] : acc;
    }, []);
  }

  getPlayerConnections() {
    return Object.keys(this.connections).reduce((acc, connId) => {
      const connection = this.connections[connId];
      const { username } = connection;
      return username ? { ...acc, connId: connection } : acc;
    }, {});
  }

  userInChannel(user) {
    for (const connId in this.connections) {
      const { username } = this.connections[connId];
      if (username === user) {
        return true;
      }
    }
    return false;
  }

  broadcast(message) {
    for (const connId in this.connections) {
      console.log(connId);
      const { connection } = this.connections[connId];
      connection.write(JSON.stringify(message));
    }
  }
}

module.exports = Channel;
