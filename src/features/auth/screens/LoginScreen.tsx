import React from 'react';
import { StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { AppText } from '@/components/typography';
import type { RootStackParamList } from '@/navigation/types';
import { spacing, useTheme } from '@/theme';
import { moderateScale } from '@/utils/scaling';
import AuthErrorText from '../components/AuthErrorText';
import AuthFooterLink from '../components/AuthFooterLink';
import AuthLayout from '../components/AuthLayout';
import KeyboardRevealTarget from '../components/KeyboardRevealTarget';
import OrDivider from '../components/OrDivider';
import PasswordInput from '../components/PasswordInput';
import SocialSignInButtons from '../components/SocialSignInButtons';
import { useLoginForm } from '../hooks/useLoginForm';
import { useSignInWithEmail } from '../queries/useSignInWithEmail';
import { useSignInWithGoogle } from '../queries/useSignInWithGoogle';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation, route }: LoginScreenProps) {
  const { t } = useTranslation('auth');
  const { colors } = useTheme();
  const verifiedEmail = route.params?.verifiedEmail;
  const form = useLoginForm(verifiedEmail);
  const googleSignIn = useSignInWithGoogle();
  const emailSignIn = useSignInWithEmail();

  const logIn = () => {
    const credentials = form.validateCredentials();
    if (!credentials) return;
    emailSignIn.mutate(credentials, {
      onSuccess: (result) => {
        if (result === 'emailNotVerified') navigation.navigate('VerifyEmail', { email: credentials.email });
      },
    });
  };

  const isPasswordStep = form.step === 'password';
  const isBusy = googleSignIn.isPending || emailSignIn.isPending;

  return (
    <AuthLayout>
      <View style={styles.header}>
        <AppText variant="displaySheet">{t('login.title')}</AppText>
        <AppText variant="bodyMedium" color="textSecondary">
          {t('login.subtitle')}
        </AppText>
      </View>

      <SocialSignInButtons
        onGooglePress={googleSignIn.start}
        googleLoading={googleSignIn.isPending}
        disabled={isBusy}
      />
      <AuthErrorText error={googleSignIn.error} />

      <OrDivider />

      {verifiedEmail && (
        <AppText variant="bodySmall" color="statusSuccess" style={styles.notice}>
          {t('login.emailVerified')}
        </AppText>
      )}
      <Input
        placeholder={t('fields.email')}
        value={form.values.email}
        onChangeText={form.setEmail}
        error={form.errors.email}
        editable={!isBusy}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType={isPasswordStep ? 'next' : 'go'}
        submitBehavior="submit"
        onSubmitEditing={form.submitEmail}
        leftIcon={<Ionicons name="mail-outline" size={moderateScale(20)} color={colors.iconMuted} />}
      />
      {isPasswordStep && (
        <PasswordInput
          placeholder={t('fields.password')}
          value={form.values.password}
          onChangeText={form.setPassword}
          error={form.errors.password}
          editable={!isBusy}
          autoComplete="current-password"
          textContentType="password"
          autoFocus={!verifiedEmail}
          returnKeyType="go"
          onSubmitEditing={logIn}
        />
      )}
      <KeyboardRevealTarget>
        <Button
          title={t(isPasswordStep ? 'login.submit' : 'login.continue')}
          loading={emailSignIn.isPending}
          disabled={isBusy}
          onPress={isPasswordStep ? logIn : form.submitEmail}
          style={styles.submit}
        />
      </KeyboardRevealTarget>
      <AuthErrorText error={emailSignIn.error} />

      <View style={styles.footer}>
        <AuthFooterLink
          prompt={t('login.noAccount')}
          action={t('login.signUp')}
          onPress={() => navigation.navigate('SignUp')}
          disabled={isBusy}
        />
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing[8],
    marginBottom: spacing[32],
  },
  notice: {
    marginBottom: spacing[12],
  },
  submit: {
    marginTop: spacing[4],
    marginBottom: spacing[8],
  },
  footer: {
    marginTop: spacing[32],
  },
});
