import { useTranslation } from 'react-i18next';
import { changeLanguage, Language } from '@/i18n';

export const useLanguage = () => {
  const { i18n } = useTranslation();
  return { language: i18n.language as Language, changeLanguage };
};
