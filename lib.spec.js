const lib = require('./lib');

describe('lib', () => {
  it('should return a string', () => {
    expect(typeof lib()).toBe('string');
  });
  it('should add correctly', () => {
    expect(lib.add(1, 2)).toBe(3);
  });
  it('should subtract correctly', () => {
    expect(lib.sub(1, 2)).toBe(-1);
  });
  it('should multiply correctly', () => {
    expect(lib.mul(1, 2)).toBe(2);
  });
  it('should divide correctly', () => {
    expect(lib.div(1, 2)).toBe(0.5);
  });
});
