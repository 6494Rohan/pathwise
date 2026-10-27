# Auth feature spec

Sign-in for pathwise: Google (native account picker) and email + password, on AWS Cognito through Amplify Gen 2. Apple is shown but disabled.

Read this folder before changing anything in `src/features/auth/`, `src/services/amplify.ts`, `src/services/secureTokenStorage.ts`, `amplify/` or `plugins/withAndroidImeInsets.js`. Update it in the same change when behaviour, setup or a decision changes.

| File | What it covers |
|---|---|
| [setup.md](setup.md) | AWS + Google Cloud setup, the sandbox backend, secrets, `amplify_outputs.json`, native dependencies, troubleshooting |
| [flows.md](flows.md) | Every user flow screen by screen, the session model, errors |
| [decisions.md](decisions.md) | Why the code is the way it is: Amplify gotchas, keyboard handling, testing setup |
| [status.md](status.md) | What is done, what is deliberately not built, and open follow-ups |

## Map of the code

| Path | Responsibility |
|---|---|
| `amplify/auth/resource.ts` | Cognito definition: email login + the four auth triggers |
| `amplify/auth/<trigger>/` | `pre-sign-up`, `define-auth-challenge`, `create-auth-challenge`, `verify-auth-challenge-response` Lambdas (Google sign-in via custom auth) |
| `amplify/auth/google/verifyGoogleIdToken.ts` | Verifies Google ID tokens (signature, issuer, audience, verified email) for the Lambdas |
| `src/services/amplify.ts` | `configureAmplify()` (called in `App.tsx`; also puts tokens in secure storage) and `getAccessToken()` (wired into the API client) |
| `src/services/secureTokenStorage.ts` | Amplify token storage on `expo-secure-store` instead of AsyncStorage |
| `services/authService.ts` | The only file that calls `aws-amplify/auth` and the Google Sign-In library. Turns Cognito errors into `AuthFailure` |
| `acl/` | Amplify shapes → our models: `toSessionUser`, `toSignInResult`, `isCustomChallenge`, `toConfirmEmailResult`, `toAuthFailure` |
| `types/auth.types.ts` | `SessionUser`, `SignInResult`, `ConfirmEmailResult`, `AuthFailure` + `AuthErrorCode`, and the Zod form schemas |
| `queries/` | `useSession` (who is signed in) and one mutation hook per action; `clearSession` |
| `hooks/` | `useLoginForm`, `useSignUpForm` (useReducer forms), `useKeyboardReveal` |
| `screens/` | `LoginScreen`, `SignUpScreen`, `VerifyEmailScreen` |
| `components/` | `AuthLayout`, `SocialSignInButtons`, `SocialButton`, `GoogleIcon`, `OrDivider`, `PasswordInput`, `AuthErrorText`, `AuthFooterLink`, `KeyboardRevealTarget`, `SignOutButton` |
| `plugins/withAndroidImeInsets.js` | Config plugin that keeps content above the Android keyboard under edge-to-edge |

## Public API (`index.ts`)

`LoginScreen`, `SignUpScreen`, `VerifyEmailScreen`, `SignOutButton`, `authKeys`, `useSession`, `useSignOut`, `clearSession`, type `SessionUser`. Services and the ACL stay private (checked by `__tests__/index.test.ts`).
