import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n, { changeLanguage, resources, restoreSavedLanguage, translateKey } from '..';

const keysOf = (value: object, prefix = ''): string[] =>
  Object.entries(value).flatMap(([key, child]) =>
    typeof child === 'object' && child !== null ? keysOf(child, `${prefix}${key}.`) : [`${prefix}${key}`]
  );

describe('i18n', () => {
  afterEach(async () => {
    await i18n.changeLanguage('en');
    await AsyncStorage.clear();
  });

  it('translates global and feature keys', () => {
    expect(translateKey('common:validation.emailRequired')).toBe('Email is required');
    expect(i18n.t('common:errors.requestFailed', { status: 500 })).toBe('Request failed with status 500');
    expect(i18n.t('jobs:title')).toBe('Opportunities');
  });

  it('saves the chosen language and restores it on the next start', async () => {
    await changeLanguage('hi');
    expect(await AsyncStorage.getItem('app.language')).toBe('hi');

    await i18n.changeLanguage('en');
    await restoreSavedLanguage();

    expect(i18n.language).toBe('hi');
  });

  it('has every English global key in every language', () => {
    const englishKeys = keysOf(resources.en.common).sort();
    for (const language of Object.values(resources)) {
      expect(keysOf(language.common).sort()).toEqual(englishKeys);
    }
  });
});
