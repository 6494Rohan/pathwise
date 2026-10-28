import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { requestStartupPermissions } from '../services/startupPermissions';

// Asks for location and notifications once `start` is true; `done` turns true whatever the user answers.
export const useStartupPermissions = (start: boolean) => {
  const { t } = useTranslation('splash');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!start) return;
    let active = true;
    requestStartupPermissions(t('notificationChannel')).finally(() => {
      if (active) setDone(true);
    });
    return () => {
      active = false;
    };
  }, [start, t]);

  return done;
};
