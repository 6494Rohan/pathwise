import React from 'react';
import { Pressable, Share } from 'react-native';
import { useTranslation } from 'react-i18next';
import ShareIcon from '@/assets/icons/share.svg';
import { spacing, useTheme } from '@/theme';
import { moderateScale } from '@/utils/scaling';

const ICON_SIZE = moderateScale(22);

export default function ShareAppButton() {
  const { t } = useTranslation('jobs');
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('share.label')}
      hitSlop={spacing[12]}
      onPress={() => Share.share({ message: t('share.message') })}
    >
      <ShareIcon color={colors.iconBrand} width={ICON_SIZE} height={ICON_SIZE} />
    </Pressable>
  );
}
