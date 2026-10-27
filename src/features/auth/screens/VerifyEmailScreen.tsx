import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { AppText } from '@/components/typography';
import type { RootStackParamList } from '@/navigation/types';
import { spacing } from '@/theme';
import { validateForm } from '@/utils/validation';
import AuthErrorText from '../components/AuthErrorText';
import AuthFooterLink from '../components/AuthFooterLink';
import AuthLayout from '../components/AuthLayout';
import KeyboardRevealTarget from '../components/KeyboardRevealTarget';
import { useConfirmEmail } from '../queries/useConfirmEmail';
import { useResendEmailCode } from '../queries/useResendEmailCode';
import { VerifyEmailSchema } from '../types/auth.types';

type VerifyEmailScreenProps = NativeStackScreenProps<RootStackParamList, 'VerifyEmail'>;

const CODE_LENGTH = 6;

export default function VerifyEmailScreen({ navigation, route }: VerifyEmailScreenProps) {
  const { t } = useTranslation('auth');
  const { email } = route.params;
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState<string>();
  const confirm = useConfirmEmail();
  const resend = useResendEmailCode();
  const isBusy = confirm.isPending || resend.isPending;

  const changeCode = (value: string) => {
    setCode(value);
    setCodeError(undefined);
  };

  const verify = () => {
    const result = validateForm(VerifyEmailSchema, { code });
    if (!result.success) {
      setCodeError(result.errors.code);
      return;
    }
    confirm.mutate(
      { email, code },
      {
        onSuccess: (outcome) => {
          if (outcome === 'signInRequired') navigation.popTo('Login', { verifiedEmail: email });
        },
      }
    );
  };

  return (
    <AuthLayout>
      <View style={styles.header}>
        <AppText variant="heading1">{t('verify.title')}</AppText>
        <AppText variant="body" color="textSecondary">
          {t('verify.subtitle', { email })}
        </AppText>
      </View>

      <Input
        placeholder={t('fields.code')}
        value={code}
        onChangeText={changeCode}
        error={codeError}
        editable={!isBusy}
        keyboardType="number-pad"
        maxLength={CODE_LENGTH}
        autoComplete="one-time-code"
        textContentType="oneTimeCode"
        autoFocus
        returnKeyType="done"
        onSubmitEditing={verify}
      />
      <KeyboardRevealTarget>
        <Button
          title={t('verify.submit')}
          loading={confirm.isPending}
          disabled={isBusy}
          onPress={verify}
          style={styles.submit}
        />
      </KeyboardRevealTarget>
      <AuthErrorText error={confirm.error ?? resend.error} />
      {resend.isSuccess && (
        <AppText variant="bodySmall" color="statusSuccess">
          {t('verify.codeSent')}
        </AppText>
      )}

      <View style={styles.footer}>
        <AuthFooterLink
          prompt={t('verify.noCode')}
          action={t('verify.resend')}
          onPress={() => resend.mutate(email)}
          disabled={isBusy}
        />
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing[8],
    marginBottom: spacing[24],
  },
  submit: {
    marginBottom: spacing[8],
  },
  footer: {
    marginTop: spacing[24],
  },
});
