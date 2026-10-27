# Status

## Done

- Google sign-in with the native Android account picker (Cognito custom auth; no browser), tested on an Android device.
- Email + password: two-step login, sign-up with name, email verification with resend, automatic sign-in after verification.
- Session restore on app start, local sign-out (Cognito + Google), 401 handling.
- Tokens in encrypted secure storage (`expo-secure-store`) instead of AsyncStorage.
- Login and Create account screens from the design, on the pathwise design system, light and dark, English and Hindi.
- Android keyboard handling: edge-to-edge insets plugin, Next between fields, submit button kept above the keyboard.

## Not built (deliberately)

| Item | What it needs |
|---|---|
| Apple sign-in | Apple Developer setup + `externalProviders.signInWithApple` in the backend; then enable the button |
| Continue as Guest | A decision on what guests can see and how API calls behave without a token |
| Terms of Service / Privacy Policy line | The two URLs |
| Forgot password | `resetPassword` / `confirmResetPassword` flow and screens |
| Google sign-in on iOS | An iOS OAuth client; set `GOOGLE_IOS_URL_SCHEME`, rebuild |
| Production backend | Amplify Console branch deploys with the `GOOGLE_CLIENT_ID` secret per branch; Android OAuth clients for the qa/preprod/prod packages and their SHA-1s (including the Play App signing key); consent screen published |

## Open follow-ups

- **Rotate the AWS access key and the Google Web client secret** used during setup: both were shared in a chat. The app no longer uses the client secret; remove it from the sandbox with `npx ampx sandbox secret remove GOOGLE_CLIENT_SECRET`.
- A fresh clone cannot typecheck or build until that developer has run `npx ampx sandbox` (see [setup.md](setup.md)).
- `zustand` is installed but currently unused.
