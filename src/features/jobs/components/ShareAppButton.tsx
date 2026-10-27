import React from 'react';
import { Pressable, Share } from 'react-native';
import { useTranslation } from 'react-i18next';
import ShareIcon from '@/assets/icons/share.svg';
import { env } from '@/config/env';
import { spacing, useTheme } from '@/theme';
import { moderateScale } from '@/utils/scaling';

const ICON_SIZE = moderateScale(22);

export default function ShareAppButton() {
  const { t } = useTranslation('jobs');
  const { colors } = useTheme();
  const jobsLink = env.EXPO_PUBLIC_WEB_URL ? new URL('/jobs', env.EXPO_PUBLIC_WEB_URL).toString() : null;
  const message = jobsLink ? t('share.messageWithLink', { url: jobsLink }) : t('share.message');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('share.label')}
      hitSlop={spacing[12]}
      onPress={() => Share.share({ message })}
    >
      <ShareIcon color={colors.iconBrand} width={ICON_SIZE} height={ICON_SIZE} />
    </Pressable>
  );
}
