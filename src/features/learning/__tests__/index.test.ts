import * as learning from '..';

describe('learning feature public API', () => {
  it('exposes its screen', () => {
    expect(Object.keys(learning)).toEqual(['LearningScreen']);
  });
});
