import * as home from '..';

describe('home feature public API', () => {
  it('exposes the screen', () => {
    expect(Object.keys(home)).toEqual(['HomeScreen']);
  });
});
