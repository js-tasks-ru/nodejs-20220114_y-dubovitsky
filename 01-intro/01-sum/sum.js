function sum(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('args no valid, please insert only number values!');
  }
  return a + b;
}

module.exports = sum;
