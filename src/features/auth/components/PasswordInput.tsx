import React, { ComponentProps, useState } from 'react';
import { Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/input';
import { spacing, useTheme } from '@/theme';
import { moderateScale } from '@/utils/scaling';

type PasswordInputProps = Omit<ComponentProps<typeof Input>, 'secureTextEntry' | 'rightAccessory'>;

const hitSlop = spacing[8];

export default function PasswordInput(props: PasswordInputProps) {
  const { t } = useTranslation('auth');
  const { colors } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  const toggle = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t(isVisible ? 'hidePassword' : 'showPassword')}
      hitSlop={hitSlop}
      disabled={props.editable === false}
      onPress={() => setIsVisible((visible) => !visible)}
    >
      <Ionicons name={isVisible ? 'eye-outline' : 'eye-off-outline'} size={moderateScale(20)} color={colors.iconMuted} />
    </Pressable>
  );

  return (
    <Input
      autoCapitalize="none"
      autoCorrect={false}
      {...props}
      secureTextEntry={!isVisible}
      rightAccessory={toggle}
    />
  );
}
