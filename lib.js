function lib() {
  return 'v0.1';
}

lib.add = (a, b) => a + b;
lib.sub = (a, b) => a - b;
lib.mul = (a, b) => a * b;
lib.div = (a, b) => a / b;
lib.mod = (a, b) => a % b;
module.exports = lib;
