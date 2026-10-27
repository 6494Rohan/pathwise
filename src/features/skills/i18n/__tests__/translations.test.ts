import { skillsTranslations } from '..';

const keysOf = (value: object, prefix = ''): string[] =>
  Object.entries(value).flatMap(([key, child]) =>
    typeof child === 'object' && child !== null ? keysOf(child, `${prefix}${key}.`) : [`${prefix}${key}`]
  );

describe('skills translations', () => {
  it('has every English key in every language', () => {
    const englishKeys = keysOf(skillsTranslations.en).sort();
    for (const translations of Object.values(skillsTranslations)) {
      expect(keysOf(translations).sort()).toEqual(englishKeys);
    }
  });
});
