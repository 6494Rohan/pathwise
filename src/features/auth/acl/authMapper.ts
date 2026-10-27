import { AuthFailure, ConfirmEmailResult, SessionUser, SignInResult } from '../types/auth.types';
import { CurrentUserDtoSchema, SignInOutputDtoSchema, SignUpOutputDtoSchema } from './auth.dto';

export const toSessionUser = (raw: unknown): SessionUser => {
  const dto = CurrentUserDtoSchema.parse(raw);
  return { id: dto.userId, username: dto.username };
};

export const toSignInResult = (raw: unknown): SignInResult => {
  const { signInStep } = SignInOutputDtoSchema.parse(raw).nextStep;
  if (signInStep === 'DONE') return 'signedIn';
  if (signInStep === 'CONFIRM_SIGN_UP') return 'emailNotVerified';
  throw new AuthFailure('unknown');
};

export const isCustomChallenge = (raw: unknown) =>
  SignInOutputDtoSchema.parse(raw).nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE';

export const toConfirmEmailResult = (raw: unknown): ConfirmEmailResult =>
  SignUpOutputDtoSchema.parse(raw).nextStep.signUpStep === 'COMPLETE_AUTO_SIGN_IN' ? 'signedIn' : 'signInRequired';
