const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {

  constructor(options) {
    super(options);
    this.initSum = 0;
    this.limit = options.limit;
    this.encoding = options.encoding;
  }

  _transform(data, encoding, callback) {
    const dataSize = getDataBytesSize(data, this.encoding || 'utf8');
    this.initSum+=dataSize;
    if (this.initSum > this.limit) {
      callback(new LimitExceededError(), null);
      return;
    }
    callback(null, data);
  }
}

const getDataBytesSize = (data, encoding) => {
  return Buffer.byteLength(data.toString(encoding));
};

module.exports = LimitSizeStream;
