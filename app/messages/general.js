const getDisconnectMessage = (channelId, username) => ({
  action: 'USER_DISCONNECTED',
  username,
  channelId
});

const getUserConnectMessage = (channelId, username) => ({
  action: 'USER_CONNECTED',
  username,
  channelId
});

const getErrorMessage = message => ({
  action: 'ERROR',
  message
});

module.exports = {
  getDisconnectMessage,
  getUserConnectMessage,
  getErrorMessage
};
