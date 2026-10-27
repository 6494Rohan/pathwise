# Setup

## How the pieces connect

```
App ──native account picker──▶ Google ──▶ ID token (audience = Web client ID)
 │
 ├─ signUp(email, random password, validationData.googleIdToken) ─▶ pre-sign-up Lambda (verifies, auto-confirms)
 └─ signIn(CUSTOM_WITHOUT_SRP) + confirmSignIn(idToken) ─▶ define / create / verify-auth-challenge Lambdas ─▶ Cognito tokens
```

No browser is involved. Email + password uses Cognito's normal SRP sign-in. Details and reasons: [decisions.md](decisions.md#native-google-sign-in).

## Backend (Amplify Gen 2)

The backend is defined in `amplify/` and deployed per developer as a **sandbox** in `ap-south-1`.

1. AWS credentials on your machine: `aws configure` (or `aws configure sso`). Check with `aws sts get-caller-identity`. The user needs rights to deploy CloudFormation, Cognito, Lambda and IAM (the `AmplifyBackendDeployFullAccess` policy, or admin).
2. Store the Google **Web** client ID as a sandbox secret (the Lambdas check ID tokens against it):
   ```bash
   npx ampx sandbox secret set GOOGLE_CLIENT_ID
   ```
   If you pipe the value in, use `printf '%s'`, never `echo` or `printf '%s\n'`: a trailing newline becomes part of the secret.
3. Deploy: `npx ampx sandbox --once` (one deploy) or `npx ampx sandbox` (watches `amplify/` and redeploys).
4. The deploy writes `amplify_outputs.json` in the project root. **The app does not typecheck or build without it.** It is git-ignored because every sandbox has its own.

`amplify/auth/` contains `resource.ts` (email login + the four triggers), one folder per trigger (`pre-sign-up`, `define-auth-challenge`, `create-auth-challenge`, `verify-auth-challenge-response`, each with `resource.ts` + `handler.ts`) and `google/verifyGoogleIdToken.ts`, the shared token check. Backend-only dev dependencies: `@aws-amplify/backend`, `@aws-amplify/backend-cli`, `aws-cdk-lib`, `constructs`, `jose`, `@types/aws-lambda`.

## Google Cloud console

All clients live in the same Google Cloud project. Client IDs are public; the app needs no secret.

| Client | Type | Used for |
|---|---|---|
| Web | Web application | Its client ID is the ID token audience: `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` in `.env` (app) and the `GOOGLE_CLIENT_ID` sandbox secret (Lambdas). Needs no redirect URIs or origins. |
| Android | Android | One per **package name + signing SHA-1**. Without a matching one the picker fails with `DEVELOPER_ERROR`. |
| iOS | iOS | Not created yet. Its reversed client ID goes in `GOOGLE_IOS_URL_SCHEME` (read by `app.config.ts`, which then adds the Google Sign-In config plugin). |

Android clients needed:

| Variant | Package name | SHA-1 |
|---|---|---|
| develop (local debug builds) | `com.pathwise.app.develop` | Debug keystore `android/app/debug.keystore`: `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25` (the standard React Native debug key) |
| qa, preprod | `com.pathwise.app.qa`, `com.pathwise.app.preprod` | The SHA-1 of whatever key signs those builds |
| prod | `com.pathwise.app` | The upload key and the Play Console **App signing key** SHA-1 |

Get a SHA-1 with `cd android && ./gradlew signingReport`, or `npx @react-native-google-signin/config-doctor` for an installed APK.

Consent screen: app name, support email, scopes `email`, `profile`, `openid`. While the app is in testing, add every tester under **Test users**.

## App configuration

| Setting | Where |
|---|---|
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | `.env`; validated (optional) in `src/config/env.ts`. Google sign-in throws a clear error if it is missing. |
| `GOOGLE_IOS_URL_SCHEME` | `.env`, read only by `app.config.ts` at build time; leave unset until the iOS client exists |

## App dependencies

All native, so after installing them a new dev build is needed (`npm run build`); Expo Go does not work.

| Package | Why |
|---|---|
| `aws-amplify`, `@aws-amplify/react-native` | Amplify JS + native polyfills (Amplify loads them itself; no setup imports needed) |
| `@react-native-google-signin/google-signin` | Native Google account picker and ID token. Android needs no config plugin; iOS does (see above) |
| `@react-native-community/netinfo`, `react-native-get-random-values`, `@react-native-async-storage/async-storage` | Amplify peer dependencies (`react-native-get-random-values` also backs `crypto.getRandomValues` for the random password) |
| `expo-secure-store` | Encrypted storage for the Cognito tokens (Android Keystore / iOS Keychain); its config plugin is in `app.config.ts` |
| `react-native-svg` | The official Google "G" logo |
| `@expo/vector-icons` + `expo-asset` | Ionicons (mail, Apple, eye, chevron). `@expo/vector-icons` fails at runtime without `expo-asset` |

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Google picker fails with `DEVELOPER_ERROR` | No Android OAuth client for this package name + SHA-1, or `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` is not a **Web** client from the same project. |
| "We couldn't sign you in" right after picking an account | The `GOOGLE_CLIENT_ID` secret differs from `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`, so the Lambdas reject the token's audience. Check the Lambda logs in CloudWatch. |
| Google sign-in fails for an email that signed up with a password but never verified it | Cognito rejects custom sign-in for unconfirmed users (`UserNotConfirmedException`). Verify the email or delete that user. |
| Deploy fails with `CDKAssetPublishError` / `AssetPublishFailed` | The CDK bootstrap bucket `cdk-hnb659fds-assets-<account>-<region>` was deleted while the `CDKToolkit` stack still exists. Recreate the bucket with the bootstrap's settings, or re-run `cdk bootstrap` after deleting `CDKToolkit` (affects every CDK app in the account/region). |
| After a failed first deploy the stack is `ROLLBACK_COMPLETE` | Run the deploy again; CDK deletes and recreates it. `aws cloudformation wait stack-rollback-complete` does **not** finish for this state. |
| Blank screen after adding a native package | The installed app was built before the package. Run `npm run build`. |
| Keyboard covers the form on Android | The `withAndroidImeInsets` plugin did not apply. Run `npx expo prebuild --clean && npm run build`. |
