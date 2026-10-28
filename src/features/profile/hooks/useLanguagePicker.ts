import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Language, resources } from '@/i18n';

const LANGUAGES = Object.keys(resources) as Language[];

export const useLanguagePicker = () => {
  const { language, changeLanguage } = useLanguage();
  const [isOpen, setOpen] = useState(false);

  const choose = (next: Language) => {
    setOpen(false);
    if (next !== language) changeLanguage(next);
  };

  return { languages: LANGUAGES, language, isOpen, open: () => setOpen(true), close: () => setOpen(false), choose };
};
