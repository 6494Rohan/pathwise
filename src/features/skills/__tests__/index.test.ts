import * as skills from '..';

describe('skills feature public API', () => {
  it('exposes its screen', () => {
    expect(Object.keys(skills)).toEqual(['SkillsScreen']);
  });
});
