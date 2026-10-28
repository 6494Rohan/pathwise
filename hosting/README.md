# Web host for deep links

A static site on **Amplify Hosting** (app `pathwise-web`, branch `main`, region `ap-south-1`) whose job is Android App Links: `https://<host>/jobs` opens the app when it is installed, and shows `index.html` otherwise. There is no custom domain yet, so the host is the Amplify default `main.<app id>.amplifyapp.com`; it lives in `.env` as `EXPO_PUBLIC_WEB_URL`.

| File | Purpose |
|---|---|
| `.well-known/assetlinks.json` | Tells Android which apps may open links on this host: one entry per package name + signing SHA-256 |
| `index.html` | Landing page for anyone opening a link without the app. A `404-200` rewrite (`/<*>` → `/index.html`) serves it for every path |

## How the app uses it

- `app.config.ts` adds an `https` intent filter with `autoVerify` for the host in `EXPO_PUBLIC_WEB_URL` (no filter when unset). Native: needs `npm run build`.
- `src/navigation/linking.ts` maps paths to screens for both `pathwise://` and the web host: `jobs` (and `jobs/<job id>`, which passes `jobId` to the Jobs tab; shared job links use it), `skills`, `learning`, `profile`, `login`, `signup`.

## Redeploy after changing a file

```bash
APP_ID=$(aws amplify list-apps --region ap-south-1 --query "apps[?name=='pathwise-web'].appId" --output text)
(cd hosting && zip -qr /tmp/site.zip .)
read JOB_ID URL < <(aws amplify create-deployment --region ap-south-1 --app-id "$APP_ID" --branch-name main --query '[jobId,zipUploadUrl]' --output text)
curl -T /tmp/site.zip "$URL"
aws amplify start-deployment --region ap-south-1 --app-id "$APP_ID" --branch-name main --job-id "$JOB_ID"
```

Check: `curl -I https://<host>/.well-known/assetlinks.json` must be `200`, `application/json`, with no redirects.

## Adding a build variant

Each package that should open links needs its own entry in `assetlinks.json`:

| Variant | Package | SHA-256 from |
|---|---|---|
| develop (debug builds) | `com.pathwise.app.develop` | `android/app/debug.keystore` (already added) |
| qa, preprod | `com.pathwise.app.qa`, `.preprod` | the key that signs those builds |
| prod | `com.pathwise.app` | Play Console → App integrity → **App signing key** SHA-256 |

Get a keystore's SHA-256 with `keytool -list -v -keystore <file> -alias <alias>`.

## Verify on a device

```bash
adb shell pm verify-app-links --re-verify com.pathwise.app.develop
adb shell pm get-app-links com.pathwise.app.develop      # host should show "verified"
adb shell am start -W -a android.intent.action.VIEW -d "https://<host>/profile"
adb shell am start -W -a android.intent.action.VIEW -d "pathwise://jobs"
```

## Moving to a real domain

Buy the domain, add it in Amplify Hosting → Domain management, update `EXPO_PUBLIC_WEB_URL`, and rebuild. Links already shared with the `amplifyapp.com` host keep working only while that host stays up and keeps its `assetlinks.json`.
