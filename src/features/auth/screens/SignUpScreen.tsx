import React, { useRef } from 'react';
import { StyleSheet, TextInputInstance, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { AppText } from '@/components/typography';
import type { RootStackParamList } from '@/navigation/types';
import { radius, spacing, ThemeColors, useTheme } from '@/theme';
import { moderateScale } from '@/utils/scaling';
import AuthErrorText from '../components/AuthErrorText';
import AuthFooterLink from '../components/AuthFooterLink';
import AuthLayout from '../components/AuthLayout';
import KeyboardRevealTarget from '../components/KeyboardRevealTarget';
import OrDivider from '../components/OrDivider';
import PasswordInput from '../components/PasswordInput';
import SocialSignInButtons from '../components/SocialSignInButtons';
import { useSignUpForm } from '../hooks/useSignUpForm';
import { useSignInWithGoogle } from '../queries/useSignInWithGoogle';
import { useSignUpWithEmail } from '../queries/useSignUpWithEmail';

type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

export default function SignUpScreen({ navigation }: SignUpScreenProps) {
  const { t } = useTranslation('auth');
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const form = useSignUpForm();
  const googleSignIn = useSignInWithGoogle();
  const signUp = useSignUpWithEmail();
  const emailRef = useRef<TextInputInstance>(null);
  const passwordRef = useRef<TextInputInstance>(null);
  const confirmPasswordRef = useRef<TextInputInstance>(null);
  const isBusy = googleSignIn.isPending || signUp.isPending;

  const createAccount = () => {
    const input = form.validate();
    if (!input) return;
    signUp.mutate(input, { onSuccess: () => navigation.navigate('VerifyEmail', { email: input.email }) });
  };

  return (
    <AuthLayout>
      <View style={styles.header}>
        <View style={styles.titles}>
          <AppText variant="displaySheet">{t('signUp.titleStart')}</AppText>
          <AppText variant="displaySheet" color="textBrand">
            {t('signUp.titleEnd')}
          </AppText>
        </View>
        <View style={styles.avatar}>
          <Ionicons name="person" size={moderateScale(28)} color={colors.iconBrand} />
        </View>
      </View>

      <SocialSignInButtons
        onGooglePress={googleSignIn.start}
        googleLoading={googleSignIn.isPending}
        disabled={isBusy}
      />
      <AuthErrorText error={googleSignIn.error} />

      <OrDivider />

      <Input
        placeholder={t('fields.name')}
        value={form.values.name}
        onChangeText={form.changeField('name')}
        error={form.errors.name}
        editable={!isBusy}
        autoComplete="name"
        textContentType="name"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => emailRef.current?.focus()}
      />
      <Input
        ref={emailRef}
        placeholder={t('fields.email')}
        value={form.values.email}
        onChangeText={form.changeField('email')}
        error={form.errors.email}
        editable={!isBusy}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => passwordRef.current?.focus()}
      />
      <PasswordInput
        ref={passwordRef}
        placeholder={t('fields.password')}
        value={form.values.password}
        onChangeText={form.changeField('password')}
        error={form.errors.password}
        editable={!isBusy}
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => confirmPasswordRef.current?.focus()}
      />
      <PasswordInput
        ref={confirmPasswordRef}
        placeholder={t('fields.confirmPassword')}
        value={form.values.confirmPassword}
        onChangeText={form.changeField('confirmPassword')}
        error={form.errors.confirmPassword}
        editable={!isBusy}
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="go"
        onSubmitEditing={createAccount}
      />
      <AppText variant="caption" style={styles.hint}>
        {t('signUp.passwordHint')}
      </AppText>
      <KeyboardRevealTarget>
        <Button
          title={t('signUp.submit')}
          loading={signUp.isPending}
          disabled={isBusy}
          onPress={createAccount}
          style={styles.submit}
        />
      </KeyboardRevealTarget>
      <AuthErrorText error={signUp.error} />

      <View style={styles.footer}>
        <AuthFooterLink
          prompt={t('signUp.haveAccount')}
          action={t('signUp.logIn')}
          onPress={() => navigation.popTo('Login')}
          disabled={isBusy}
        />
      </View>
    </AuthLayout>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing[32],
    },
    titles: {
      flexShrink: 1,
    },
    avatar: {
      padding: spacing[16],
      borderRadius: radius.full,
      backgroundColor: colors.bgBrandSoft,
    },
    hint: {
      marginBottom: spacing[16],
    },
    submit: {
      marginBottom: spacing[8],
    },
    footer: {
      marginTop: spacing[32],
    },
  });
