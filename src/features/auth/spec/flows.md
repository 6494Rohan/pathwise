# Flows

## Session

- **Source of truth:** Amplify. Its tokens are kept in the device's secure storage (Android Keystore / iOS Keychain via `expo-secure-store`), not AsyncStorage; see [decisions.md](decisions.md#token-storage). The app mirrors "who is signed in" in React Query under `authKeys.session()` (`useSession`, `staleTime: Infinity`). There is no Zustand auth store.
- **Startup (guest browsing):** `AppNavigator` renders nothing while `useSession` is pending, then always opens the `Main` tabs (Jobs, Skills, Learning, Profile). `Login` / `SignUp` / `VerifyEmail` are registered only while the session is `null`, so signing in removes them and returns to the tabs.
- **Header action:** `HeaderPrimaryAction` (navigation) shows `SignUpHeaderButton` (opens `SignUp`) to guests and the profile feature's Upload Resume button when signed in. Profile shows Sign out only when signed in.
- **Signing in** never navigates to the tabs directly. Mutations update the session (`setQueryData` or `invalidateQueries`), and the navigator drops the auth screens, returning to the tabs.
- **API token:** every request calls `getAccessToken()` → `fetchAuthSession()`, so Amplify refreshes expired tokens. Nothing caches the token.
- **401 from the API:** `App.tsx` calls `clearSession(queryClient)`, which sets the session to `null` and removes every other cached query. Amplify's saved session is not cleared, so the next app start restores it.

## Google

1. Login or SignUp → **Continue with Google** → `useSignInWithGoogle().start()`.
2. Step one, `authService.pickGoogleAccount()`: Android's native account picker opens (`GoogleSignin.signIn()`, configured with the Web client ID). The screen does **not** lock or show a spinner here; the picker is modal. Dismissing it returns `null`: no error, nothing on screen changes.
3. Step two, `authService.signInWithGoogleAccount(account)`, runs only with a picked account; the screen locks from here.
4. The app calls `signUp` for that email with `validationData.googleIdToken`; the `pre-sign-up` Lambda verifies the token and auto-confirms. If the email already has an account (`UsernameExistsException`), it continues.
5. `signIn` with `CUSTOM_WITHOUT_SRP`, then `confirmSignIn` with the Google ID token; the `verify-auth-challenge-response` Lambda checks it. On success the session is set from `getCurrentUser()` → back to the tabs.
6. Any failure (picker or Cognito) shows `errors.unknown` under the Google button.

## Email: log in (two steps, like the design)

1. Enter email → **Continue** (or keyboard **Go**). `useLoginForm` validates it with `EmailSchema`, then shows the password field.
2. Editing the email returns to step 1.
3. Enter password → **Log in** → `useSignInWithEmail` → `signIn({ username: email, password })`.
   - `DONE` → session refetched → back to the tabs.
   - `CONFIRM_SIGN_UP` (account never verified) → a new code is sent (`resendSignUpCode`) → `VerifyEmail`.
   - Any other Cognito step (MFA, new password) is not configured and maps to `AuthFailure('unknown')`.

## Email: sign up

1. Name, Email, Password, Confirm password → **Sign up**. `useSignUpForm` validates with `SignUpSchema`. The password rule mirrors the Cognito default policy: 8+ characters with upper and lower case, a number and a symbol.
2. `signUp` with `userAttributes: { email, name }` and `autoSignIn: true` → `VerifyEmail`.

## Verify email

1. Enter the 6-digit code → **Verify** → `confirmSignUp`.
   - `COMPLETE_AUTO_SIGN_IN` → `autoSignIn()` → session refetched → back to the tabs.
   - Otherwise (for example reached from Login, where auto sign-in was not requested) → back to Login with `verifiedEmail` param: email prefilled, password step shown, "Email verified" notice.
2. **Resend** → `resendSignUpCode`.

## Sign out

`SignOutButton` (on the Profile tab) → `useSignOut` → Amplify `signOut()` (local, no browser) and `GoogleSignin.signOut()` (so the next Google sign-in shows the picker) → `clearSession` → the user stays on the tabs as a guest.

## Errors

Cognito error names map to `AuthErrorCode` in `acl/authErrorMapper.ts`; `AuthErrorText` shows `t('errors.<code>')`.

| Cognito error | Code | Shown as |
|---|---|---|
| `NotAuthorizedException`, `UserNotFoundException` | `wrongCredentials` | "Incorrect email or password." (never reveals whether the email exists) |
| `UsernameExistsException` | `emailTaken` | Log in instead |
| `InvalidPasswordException` | `weakPassword` | Password rules not met |
| `CodeMismatchException` | `invalidCode` | Wrong code |
| `ExpiredCodeException` | `codeExpired` | Tap Resend |
| `LimitExceededException`, `TooManyRequestsException`, `TooManyFailedAttemptsException` | `tooManyAttempts` | Wait and retry |
| anything else | `unknown` | Generic message |
