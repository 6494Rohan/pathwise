# Decisions and gotchas

Each item records something that is not obvious from the code, and why it is done this way.

## Token storage

**Decision:** Cognito tokens are stored in `expo-secure-store`, not Amplify's React Native default (AsyncStorage).

- **Why:** AsyncStorage is unencrypted app storage. The refresh token works like a long-lived password (it mints new access tokens for weeks), so it belongs in the OS secure store: Android Keystore-encrypted storage and the iOS Keychain.
- **How:** `src/services/secureTokenStorage.ts` implements Amplify's `KeyValueStorageInterface` on top of `expo-secure-store`. `configureAmplify()` registers it with `cognitoUserPoolsTokenProvider.setKeyValueStorage(secureTokenStorage)` right after `Amplify.configure`.
- **Keys:** SecureStore allows only letters, digits, `.`, `-` and `_`, so `toSecureStoreKey` replaces anything else with `_`. Amplify's keys look like `CognitoIdentityServiceProvider.<clientId>.<username>.<tokenType>`.
- **`clear()`:** SecureStore cannot list its keys, so the adapter keeps an index of written keys under `pathwise.secureTokenStorage.index`. Index updates run one at a time because Amplify writes several tokens in parallel (a test covers the race). Amplify's Cognito code does not call `clear()` today; it exists because the interface requires it.
- **Config plugin:** `["expo-secure-store", { faceIDPermission: false }]` in `app.config.ts`. It excludes the secure store from Android Auto Backup (restored entries could not be decrypted after reinstall). No Face ID permission because the app doesn't use biometric-protected items.
- **Consequences:** native module, so a rebuild is needed. Sessions saved before this change (in AsyncStorage) are not migrated; those users sign in once more. Secure-store data does not survive uninstalling the app.
- **Don't** keep tokens anywhere else (React Query, Zustand, AsyncStorage, logs). Read them with `getAccessToken()` when needed.

## Native Google sign-in

**Decision:** Google sign-in uses the native Android account picker (`@react-native-google-signin/google-signin`) and Cognito **custom authentication**, not Cognito's hosted web login.

- **Why:** the hosted web login opened a full-screen browser for sign-in, and on Android Amplify's OAuth sign-out never completed: it calls `openAuthSession(logoutUrl)` without the redirect URLs, so `rtn-web-browser` always reports `canceled` and Amplify keeps the tokens. `preferPrivateSession: true` stopped the loop but still flashed the browser on every sign-out. The native picker removes the browser from both sign-in and sign-out.
- **How it fits together:**
  1. The app shows the picker and gets a Google **ID token** whose audience is the **Web** client ID (`EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`, passed as `webClientId`).
  2. `signUp` with that email, a random password and `validationData.googleIdToken`. The `pre-sign-up` Lambda verifies the token and auto-confirms the user (Google already verified the email). `UsernameExistsException` means the user exists; continue.
  3. `signIn({ authFlowType: 'CUSTOM_WITHOUT_SRP' })` → `define-auth-challenge` asks for one `CUSTOM_CHALLENGE` → `create-auth-challenge` labels it `GOOGLE_ID_TOKEN` → `confirmSignIn({ challengeResponse: idToken })` → `verify-auth-challenge-response` accepts it only if the token is valid for that email → Cognito issues normal user-pool tokens.
- **Token checks** (`amplify/auth/google/verifyGoogleIdToken.ts`, using `jose`): signature against Google's JWKS, issuer `accounts.google.com`, audience = Web client ID (the `GOOGLE_CLIENT_ID` secret), `email_verified === true`, and email equal to the Cognito user's email. Anything else fails.
- **Sign-up comes first** because the user pool has "prevent user existence errors" on: a custom sign-in for an unknown email fails with a generic error, while `signUp` reports `UsernameExistsException`.
- **Same email = same account.** A Google sign-in with the email of an existing email + password account signs in to that account. That is safe because Google verified the email; it is also how the two are linked.
- **Random password:** 48 hex characters + `Aa1!` to satisfy the policy. Google users never use it; "Forgot password" (not built) would let them set one.
- **Sign-out** is local: Amplify `signOut()` (no OAuth config, so no browser) then `GoogleSignin.signOut()` so the next sign-in shows the account picker again.
- **Removed:** the Google `externalProviders` entry, the Cognito hosted domain, `amplify/auth/redirectUrls.ts`, the per-variant redirect filtering in `src/services/amplify.ts`, `preferPrivateSession`, and `@aws-amplify/rtn-web-browser`. The `GOOGLE_CLIENT_SECRET` sandbox secret is no longer used.
- **Costs:** four Lambdas to maintain (the verification is security-critical; keep its tests), and one **Android OAuth client per package name + signing SHA-1** in Google Cloud (see [setup.md](setup.md)).
- **Considered:** keeping the hosted web login with `preferPrivateSession` (rejected: browser still flashes), and a half-height Custom Tab (rejected: still a web page).

## Amplify

- **Session lives in React Query, not Zustand.** Cognito owns it; a second copy would go stale. The old placeholder `useUserStore` / `useAuth` in the `user` feature was removed.
- **Never `queryClient.clear()` on sign-out.** It removes the session query the navigator is observing; a later `setQueryData` creates a new query that nobody watches, so the screen never changes. `clearSession` sets the session first and removes only the other queries. `AppNavigator.test.tsx` covers this.
- **Errors leave the service as `AuthFailure`.** Screens never see Cognito error names; `toAuthFailure` passes an existing `AuthFailure` through unchanged.

## UI

- **Apple button is rendered disabled** (`SocialSignInButtons`). Enabling it natively would follow the Google pattern: `expo-apple-authentication` for the identity token, and the verify Lambdas accepting Apple tokens too.
- **Screens lock while a request runs.** Login, SignUp and VerifyEmail derive one `isBusy` from their mutations' `isPending`: fields get `editable={false}` (the shared `Input` dims, the password eye locks), and every button and footer link is disabled. The button whose request is running shows its spinner instead of dimming. This stops a second sign-in starting mid-flight. Google's account picker is deliberately **not** part of the lock: `useSignInWithGoogle` runs the picker and the Cognito sign-in as two mutations and only reports `isPending` for the second, because dimming the form behind the (already modal) picker made the screen flicker when the picker was dismissed.
- **Google "G" uses hard-coded brand colours** (`GoogleIcon.tsx`). Google's branding rules require the official multicolour mark; everything else uses theme tokens.
- **Import `Ionicons` from `@expo/vector-icons/Ionicons`**, not the package root. Metro has no tree shaking; the root import loads every icon set.
- **The shared `Input`** gained `leftIcon`, `rightAccessory` and `ref` (forwarded to `TextInput`, typed `Ref<TextInputInstance>`). Its filled `bgMuted` look follows the auth design and applies app-wide.
- **Ref types in React Native 0.88:** use the instance types (`TextInputInstance`, `ScrollViewInstance`, `ViewInstance`), not the component types.

## Keyboard

- **Android edge-to-edge** (`edgeToEdgeEnabled=true`, target SDK 36) stops `adjustResize` from shrinking the window. `plugins/withAndroidImeInsets.js` (copied from `hotmess-demo`) adds code to `MainActivity.kt` that pads the root view by the keyboard height, animated with the keyboard. Native change: needs a rebuild.
- **Moving between fields:** `returnKeyType="next"`, `submitBehavior="submit"` (keeps the keyboard open) and `onSubmitEditing` focusing the next field's ref. The last field submits the form.
- **Focused field into view:** Android's `ReactScrollView.requestChildFocus` already scrolls the focused field into view, so there is no JS code for that.
- **Submit button into view:** `AuthLayout` + `useKeyboardReveal` scroll so the element wrapped in `KeyboardRevealTarget` (the submit button) sits above the keyboard. It runs on `keyboardDidShow` and again on the scroll view's `onLayout`, because the Android padding shrinks the view after the event. It only scrolls if the button is hidden.
- **iOS** uses `automaticallyAdjustKeyboardInsets` on the same `ScrollView`.

## Testing

- `jest.setup.ts` mocks `aws-amplify`, `aws-amplify/auth`, `aws-amplify/auth/cognito` and `@react-native-google-signin/google-signin` for every test (default: signed in as `user-1`; email calls succeed; the picker returns `rohan@example.com` with token `google-id-token`), and replaces `@expo/vector-icons/Ionicons` with a string component because Jest cannot load its font asset.
- `jest.env.ts` (Jest `setupFiles`) sets `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` before `src/config/env.ts` is loaded.
- `jest.config.js` maps `amplify_outputs.json` to `src/test-utils/amplifyOutputs.json`, so tests do not need a deployed backend.
- Lambda tests live next to each trigger in `amplify/auth/*/__tests__/`; they mock `jose` (ESM-only) and `isGoogleTokenFor`.
- Screens get `navigation` / `route` props directly in tests (`navigation as never`).
- Override Amplify per test with `jest.mocked(signIn).mockRejectedValueOnce(...)`. Name Cognito errors with `Object.assign(new Error(), { name: 'NotAuthorizedException' })`.
