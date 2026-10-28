# Splash feature spec

The app opens on a branded splash: the native splash (logo on brand indigo) hands over to an animated one, which asks for startup permissions and fades out once the app is ready.

## Flow

```
Native splash (expo-splash-screen plugin, app.config.ts) — held by preventAutoHideAsync() in App.tsx
  → AppSplash mounts over the navigator; SplashAnimation's first layout calls SplashScreen.hide()
    (same logo, 120 dp, same #4F46E5 background, centred → no visible jump)
  → intro, ~1.3 s: logo pops (scale 1.12 → spring to 1), a white ring pulses out behind it,
    app name and tagline slide up
  → startup permissions: location, then notifications ("Getting things ready…" shown meanwhile)
  → exit when permissions are answered AND the session is known: logo scales up, splash fades (380 ms)
```

## Map of the code

| Path | Responsibility |
|---|---|
| `components/AppSplash.tsx` | Decides when to leave: intro done + permissions done + `useSession` no longer pending |
| `components/SplashAnimation.tsx` | Reanimated animations (transform/opacity only, UI thread), hides the native splash, light status bar |
| `hooks/useStartupPermissions.ts` | Starts the permission requests once the intro has played; `done` whatever the answers |
| `services/startupPermissions.ts` | Location (foreground) and notifications; creates the Android `default` notification channel first |

## Decisions

- **Permissions are asked only once, at first launch.** Each is requested only while its status is `undetermined`; a user who said no isn't asked on every launch. Features still ask in context when they need it (the map's my-location button does).
- **Nothing blocks startup.** A failed check or request is ignored; the splash leaves either way.
- **The logo size is not scaled.** `LOGO_SIZE` must equal the plugin's `imageWidth` (120 dp) so the hand-off lines up. The background is `colors.bgSplash`, which is the same in light and dark mode, matching the native splash.
- **Reduce motion:** with the system setting on, there is no pop, pulse or slide; the splash shows statically and fades quickly.
- **Changing the native splash** (logo, colour, size) needs a native build (`npm run build`), and Expo Go doesn't show it. Android 12+ draws the native splash icon inside a circle, so the very first frame differs slightly there.

## Not built yet

An explanation screen before the system permission prompts, and tests for this feature.
