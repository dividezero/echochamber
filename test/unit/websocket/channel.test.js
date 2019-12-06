const ChannelTest = require('../../../app/connections/websocket/channel');

describe('channel', () => {
  const connection = id => ({
    id,
    write: message => {
      this.testWrite.push(message);
    }
  });

  beforeAll(() => {
    this.channel = new ChannelTest('someChannelId');
    this.testWrite = [];
  });

  it('should add new connection', () => {
    const testConn = connection('someId');
    this.channel.addConnection(testConn);

    expect(this.channel.hasConnection(testConn.id)).toBe(true);
  });

  it('should remove new connection', () => {
    const testConn = connection('someId');
    expect(this.channel.hasConnection(testConn.id)).toBe(true);
    this.channel.removeConnection(testConn.id);
    expect(this.channel.hasConnection(testConn.id)).toBe(false);
  });

  it('should broadcast new connection', () => {
    const testConn1 = connection('1');
    const testConn2 = connection('2');
    this.channel.addConnection(testConn1);
    this.channel.addConnection(testConn2);

    this.channel.broadcast('test message');

    expect(this.testWrite.length).toBe(2);
  });
});
