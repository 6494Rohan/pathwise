import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSession } from '@/features/auth';
import { useStartupPermissions } from '../hooks/useStartupPermissions';
import SplashAnimation from './SplashAnimation';

// Covers the app until the intro has played, startup permissions are answered and the session is known.
export default function AppSplash() {
  const { t } = useTranslation('splash');
  const { isPending: isSessionPending } = useSession();
  const [introDone, setIntroDone] = useState(false);
  const [visible, setVisible] = useState(true);
  const permissionsDone = useStartupPermissions(introDone);
  const finishIntro = useCallback(() => setIntroDone(true), []);
  const hide = useCallback(() => setVisible(false), []);

  if (!visible) return null;

  return (
    <SplashAnimation
      appName={t('appName')}
      tagline={t('tagline')}
      status={introDone && !permissionsDone ? t('preparing') : null}
      leaving={introDone && permissionsDone && !isSessionPending}
      onIntroDone={finishIntro}
      onLeft={hide}
    />
  );
}
