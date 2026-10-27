import { learningTranslations } from '..';

const keysOf = (value: object, prefix = ''): string[] =>
  Object.entries(value).flatMap(([key, child]) =>
    typeof child === 'object' && child !== null ? keysOf(child, `${prefix}${key}.`) : [`${prefix}${key}`]
  );

describe('learning translations', () => {
  it('has every English key in every language', () => {
    const englishKeys = keysOf(learningTranslations.en).sort();
    for (const translations of Object.values(learningTranslations)) {
      expect(keysOf(translations).sort()).toEqual(englishKeys);
    }
  });
});
