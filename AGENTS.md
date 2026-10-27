# pathwise

Expo managed-workflow React Native app (TypeScript). Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo changes fast — do not trust your training data

Before writing code that touches an Expo, EAS, or React Native API:

1. Read the major version of `expo` in `package.json`.
2. Use the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, start from https://docs.expo.dev/llms.txt. Never answer from memory.

Check the skills in `.claude/skills/` (Expo, Callstack React Native, clean-code-principles) before adding dependencies or designing a feature.

## Commands

```bash
npx expo install <package>  # ALWAYS use instead of npm install — resolves SDK-compatible versions
npm start                   # dev server
npm run lint                # lint
npx tsc --noEmit            # typecheck
npm test                    # component and unit tests
npx expo-doctor             # diagnose dependency and config issues
npm run build               # prebuild + run on Android (npm run build:ios for iOS)
npm run build:apk           # release APK for arm64 phones (android/app/build/outputs/apk/release/)
npx ampx sandbox --once     # deploy your Amplify sandbox backend and write amplify_outputs.json (needed after cloning)
```

## Project structure

| Path | Responsibility |
|---|---|
| `src/components/` | Shared UI built on the theme, grouped by category: `button/` (`Button`, `PillButton`), `typography/` (`AppText`), `input/` (`Input`), `common/` (`SafeAreaScreen`, `Header`, `ComingSoon`). Import from the category folder: `import { Button } from '@/components/button'`. There is no global `src/components/index.ts`. |
| `src/features/<feature>/` | One folder per feature, including its screens — see **Feature structure** below. |
| `src/services/api.ts` | The shared axios client — the only place HTTP happens. Feature services validate its responses with Zod. |
| `src/services/queryClient.ts` | The shared React Query client (defaults). |
| `src/i18n/` | i18next setup and global strings (`locales/<lang>.json`). Feature strings live in each feature's `i18n/`. |
| `src/hooks/` | Global hooks only: app-wide or used by 2+ features (e.g. `useRefetchOnAppFocus`). Feature hooks live in the feature's `hooks/`. |
| `src/config/env.ts` | Zod-validated `EXPO_PUBLIC_*` env vars. Read env through `env`, never `process.env` elsewhere. |
| `src/theme/` | Design tokens: `colors.ts` (`lightColors` + `darkColors`), `spacing.ts`, `radius.ts`, `typography.ts`, and `useTheme()`. |
| `src/utils/scaling.ts` | `scale`, `verticalScale`, `moderateScale`, `fontScale` (clamped to the phone size range, pixel-rounded). Used by the theme; see **Sizing and scaling** for direct use. |
| `src/utils/validation.ts` | `validateForm(schema, values)` for form field errors. |
| `src/navigation/` | React Navigation navigators (this project does **not** use Expo Router). `TabNavigator` builds the bottom tabs from its `TABS` config (route, screen, i18n namespace, icon); each tab's label is `<namespace>:tabTitle` and its header title `<namespace>:title`. The tab bar is the custom `components/AppTabBar` (it honours `tabBarHideOnKeyboard`, on for all tabs) and every tab gets the shared `Header` (with `headerRight` actions) through `screenOptions`. Tab screens use `<SafeAreaScreen edges={[]}>` because the header and tab bar already apply the insets. |
| `src/services/amplify.ts`, `src/services/secureTokenStorage.ts` | App-wide Amplify setup and token storage — see the [auth spec](src/features/auth/spec/README.md). |
| `amplify/` | Amplify Gen 2 backend, deployed per developer with `npx ampx sandbox --once`. Typecheck with `npx tsc -p amplify --noEmit`. Details in the [auth spec](src/features/auth/spec/setup.md). |
| `plugins/` | Expo config plugins (`withAndroidImeInsets` keeps content above the Android keyboard). Native: changing one needs `npm run build`. |

### Feature structure

Everything for one feature lives in `src/features/<feature>/`. **All screens live inside a feature** — there is no global `screens/` folder. Every feature has a `components/` folder for UI used only by that feature; create the other subfolders only when the feature needs them.

```
src/features/<feature>/
├── screens/       .tsx  screens of this feature (e.g. ProfileScreen.tsx)
├── components/    .tsx  UI used only by this feature (LoginForm.tsx) — props in, callbacks out; screens keep the logic
├── i18n/          .json this feature's translations (en.json, hi.json) + index.ts — see Strings and translations
├── hooks/         .ts   feature logic hooks, e.g. useReducer form hooks (useProfileForm.ts)
├── queries/       .ts   React Query: <feature>Keys.ts + one hook per file (useUserProfile.ts, useUpdateProfile.ts)
├── acl/           .ts   anti-corruption layer: backend DTOs + mappers (user.dto.ts, userMapper.ts) — see below
├── services/      .ts   HTTP calls through the ACL (userService.ts) — return frontend models; only queries call these
├── store/         .ts   Zustand client state (userStore.ts) — only if the feature needs shared client state
├── types/         .ts   frontend models + form schemas only, our naming (user.types.ts)
├── spec/          .md   the feature's spec: setup, flows, decisions, status — see Feature specs
└── index.ts             public API: screens, query hooks, store hook, models/form schemas — never services or acl
```

- **Name files after their main export:** `useUserProfile.ts`, `userService.ts`, `userStore.ts`; components and screens in PascalCase. `.tsx` only for files that return JSX.
- **Import other features through their `index.ts`** (`import { useLoginStore } from '@/features/login'`), never from their internal folders. Navigators import screens the same way.
- **Imports:** use the `@/` alias (= `src/`) for anything outside the current feature or folder — `import { Button } from '@/components/button'`. Use relative paths only inside the same feature or folder (`'../types/login.types'`). Never write `'../../../'`.
- **Hooks:** a hook used by one feature goes in that feature's `hooks/` (`features/login/hooks/useLoginForm.ts`). Only hooks that are app-wide or used by 2+ features go in global `src/hooks/` (`useRefetchOnAppFocus.ts`). React Query hooks stay in the feature's `queries/` and store hooks in its `store/`.
- **Shared code** used by 2+ features goes in `src/components/`, `src/hooks/` or `src/utils/`; move it there when the second feature needs it.

### Feature specs

Feature-specific context lives with the feature, not in this file. A feature that has external setup, non-obvious flows or hard-won decisions keeps a `spec/` folder of Markdown files (start with `spec/README.md`): why the code is the way it is, how to set it up, and what is not built yet.

| Spec | Read it before changing |
|---|---|
| [`src/features/auth/spec/`](src/features/auth/spec/README.md) | `src/features/auth/`, `src/services/amplify.ts`, `src/services/secureTokenStorage.ts`, `amplify/`, `plugins/withAndroidImeInsets.js`, or anything about sign-in, the session or tokens |
| [`src/features/jobs/spec/`](src/features/jobs/spec/README.md) | `src/features/jobs/`, the map, or the `react-native-maps` plugin in `app.config.ts` |

- **Read the relevant `spec/` before changing that code.** Add a row here when a new feature gets a spec.
- **Update the spec in the same change** when behaviour, setup, a decision or the status changes. A stale spec is worse than none.
- Write for a developer or agent new to the feature: facts, file paths and the *why*, not narration. Never put secrets, keys or account-specific IDs in a spec.

### Strings and translations (mandatory)

No hard-coded user-facing text. Global strings live in `src/i18n/locales/<lang>.json` (namespace `common`); each feature's strings live in `features/<feature>/i18n/<lang>.json` (namespace `<feature>`), registered in `resources` in `src/i18n/index.ts`.

- Use `const { t } = useTranslation('<feature>')` → `t('title')`; global: `t('common:actions.retry')`; values via `t('email', { email })`, never string concatenation.
- Add a key to `en.json` first, then every other language — a missing translation fails `tsc`.
- A string belongs to its feature; move it to the global file only when a second feature needs it.
- Zod messages are translation keys (`z.email('common:validation.emailInvalid')`); `validateForm` translates them.
- Change language with `useLanguage().changeLanguage('hi')`; the choice is saved, otherwise the phone language is used.

### Testing (component and unit tests)

Jest with the `jest-expo` preset and React Native Testing Library (`@testing-library/react-native`). Config: `jest.config.js`, `jest.setup.ts` (initialises i18n and mocks native modules).

- **Location:** tests live in a `__tests__/` folder inside the folder whose code they test — `components/button/__tests__/Button.test.tsx`, `features/login/hooks/__tests__/useLoginForm.test.ts`. Tests for root-level files (e.g. `App.tsx`) go in the `__tests__/` folder next to them.
- **Every folder that contains code has a `__tests__/` folder** covering all the code in it — components, screens, hooks, queries, services, stores, ACL mappers, schemas, config and utils. A feature root's `__tests__/index.test.ts` checks its public API (and that `services/` and `acl/` stay private); a feature `i18n/` test checks every language has all English keys. Only type-only folders (no runtime code), `spec/` folders and `test-utils/` have no tests.
- **How:** `render` and events are async — `await render(<Button … />)`, `await fireEvent.press(…)`. Query like a user (`getByRole`, `getByText`, `getByPlaceholderText`); use `testID` only when there is no visible text. Assert with the built-in matchers (`toBeOnTheScreen`, `toHaveTextContent`).
- Components that need React Query: `renderWithProviders` from `@/test-utils/renderWithProviders`.
- Text in tests is the real English translation (i18n is initialised in `jest.setup.ts`).
- Run `npm test` (`npm run test:coverage` for coverage).

### Anti-corruption layer (mandatory for every API call)

Backend shapes and names never leave a feature's `acl/` and `services/`. Everything else — queries, stores, hooks, screens — only sees frontend models with our naming.

```
GET:  api response (backend names) → acl: DTO schema validates → mapper → frontend model → queries → screens
SEND: form values / frontend model → acl: mapper → request DTO (backend names) → api
```

- `acl/<feature>.dto.ts` — backend shapes: Zod schemas for responses (`UserProfileDtoSchema`), interfaces for request bodies (`UpdateProfileRequestDto`). Named exactly as the backend names them.
- `acl/<feature>Mapper.ts` — inbound mappers take `unknown`, validate with the DTO schema, then map (`toUserProfile(raw)`); outbound mappers turn a model into a request DTO (`toUpdateProfileRequest(input)`).
- Services always go through the mappers: `return toUserProfile(await api.get(url))` and `api.put(url, toUpdateProfileRequest(input))`. Never return a raw response or send a model/form object directly.
- `types/` holds only frontend models and form schemas. A model never mirrors backend naming; if the backend renames a field, only the mapper changes.
- `acl/` is private: never export it from the feature's `index.ts`, and never import a DTO outside `acl/` and `services/`.

## Conventions

- **Comments (strict):** write none by default — clear names and small functions explain the code. Add a comment only when the *why* cannot be read from the code (a platform gotcha, a workaround, a temporary branch to remove), and keep it to one or two lines. Never restate what the code does, and never add file headers, section banners, JSDoc on self-explanatory props, TODO lists or commented-out code.
- **Styling:** follow the Design system section below — theme tokens and `AppText` only, no hard-coded colors, font sizes or spacing.
- **API calls:** always through React Query. Screens and components use hooks from the feature's `queries/` (`useQuery` for reads, `useMutation` for writes); they never call a service or `api` directly and never keep server data in `useState`/stores. Define query keys in `queries/<feature>Keys.ts` and invalidate or `setQueryData` after mutations.
- **HTTP:** every request goes through `api` from `src/services/api.ts` (axios): `api.get(url)`, `api.post(url, body)`, etc. They return `unknown`, so each feature service passes the response through its ACL mapper: `return toUserProfile(await api.get('/me'))` (see **Anti-corruption layer**). Never import `axios` or call `fetch` anywhere else. The client sets the base URL from env, a 15s timeout, the `Authorization` header (token wired in `App.tsx` via `configureApi`) and turns failures into `ApiError` with a user-readable `message`. Add token refresh in its 401 interceptor, not in features.
- **Validation:** use Zod for every boundary — API responses (DTO schemas in the feature's `acl/`), forms (`validateForm`), env vars. Define a schema once and infer the type with `z.infer`; don't write a parallel `interface` for the same shape. Frontend models that never need runtime validation can be plain interfaces.
- **Config:** native config lives in `app.config.ts` (build variants via `EXPO_PUBLIC_APP_VARIANT`). `ios/` and `android/` are generated by prebuild — never edit them by hand.
- After adding a library with native code, a development build is needed (`npm run build`); Expo Go won't have it.

## Design system (mandatory)

The app follows the phone's light/dark setting. All visual values come from `src/theme/` — screens and components never contain hex colors, raw font sizes or spacing numbers.

| Need | Use |
|---|---|
| Colors | `const { colors } = useTheme()` → `colors.<name>`, named after the Figma variables (`bg/brand` → `bgBrand`): brand `bgBrand`, `bgBrandSubtle`, `bgBrandSoft`, `bgBrandPressed`, `textBrand`, `borderBrand`, `iconBrand`; surfaces `bgCanvas`, `bgSubtle`, `bgMuted`, `bgScrim`; content `textPrimary`, `textSecondary`, `textTertiary`, `textOnBrand`, `iconDefault`, `iconMuted`, `iconOnBrand`; borders `borderDefault`, `borderStrong`; status `statusSuccess`/`statusWarning`/`statusDanger` + `…Bg`; accents `accentViolet`/`accentTeal` + `…Bg`. Never import a palette directly. Need a new color? Add it to **both** `lightColors` and `darkColors` in `colors.ts` (a missing dark value fails `tsc`). |
| Text | `<AppText variant="...">` — Plus Jakarta Sans, named after the Figma text styles: `displaySheet`, `heading1`–`heading3`, `titleCard`, `body`, `bodyMedium`, `bodySmall`, `labelLarge`, `labelMedium`, `labelSmall`, `caption` (plus `code`, monospace). Change color with `color="statusDanger"` etc. The font is embedded at build time by the `expo-font` plugin in `app.config.ts`, so changing it needs a new native build. Never set `fontSize`/`fontWeight` in a screen. |
| Spacing (padding, margin, gap) | `spacing[n]`, keyed by the Figma `space/n` token — `2`, `4`, `6`, `8`, `12`, `16`, `20`, `24`, `32` (already scaled). Use the nearest step. |
| Corner radius | `radius` — `sm` 8, `md` 12, `lg` 16, `xl` 24 (already scaled), `full` 999 for pills. Larger containers get larger corners. |
| Screen root | Wrap every screen in `<SafeAreaScreen>` from `src/components/common` — it adds safe-area padding and the app background. Default edges are top and bottom; pass `edges={['top']}` etc. to change them. Never use `SafeAreaView` or a full-screen `View` with `flex: 1` and a background directly. |
| Buttons, inputs | `Button` (`variant`: `primary` / `secondary`, `loading`) and `Input` (`error`, `leftIcon`, `rightAccessory`, `variant`: `filled` / `floating` (white pill over a map), `ref` forwarded to the `TextInput`) from `src/components/button` and `src/components/input`. Don't use React Native's `Button` or style `TextInput` per screen. In forms, chain fields with `returnKeyType="next"`, `submitBehavior="submit"` and `onSubmitEditing` → next field's `ref.focus()`. |
| Icons | `Ionicons` imported from `@expo/vector-icons/Ionicons` (never the package root — Metro has no tree shaking), sized with `moderateScale(n)`, coloured with `colors.icon*`. Custom icons: `.svg` files in `src/assets/icons/` using `currentColor`, imported as components. |
| Element sizes, icons, touch targets | See **Sizing and scaling** below. |

Styles that use colors are created from the current theme; styles without colors stay a plain static `StyleSheet`:

```tsx
import { spacing, ThemeColors, useTheme } from '@/theme';

export default function ProfileCard() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return <View style={styles.card}>…</View>;
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: { padding: spacing[16], backgroundColor: colors.bgSubtle },
  });
```

`SafeAreaScreen`, `AppText`, `Button` and `Input` already follow the theme, so screens built from them need no color code. Navigation headers, the tab bar and the status bar follow it too (`useNavigationTheme` in `AppNavigator`).

- **A value you need twice belongs in the theme** — add it to `colors.ts`, `spacing.ts`, `radius.ts` or `typography.ts` instead of inlining it.
- Shared components accept a `style` prop for layout only (margin, flex, width), never to change colors.
- A view used by one feature lives in that feature's `components/`; move it into `src/components/` only once a second feature needs it. Put it in the matching category folder (`button/`, `typography/`, `input/`, `common/`, or a new one such as `card/`) and export it from that folder's `index.ts` (every category folder has one). Import components from their folder (`'@/components/button'`), never through a global barrel — Metro has no tree shaking, so a global `index.ts` would load every component for every import. Don't add a `src/components/index.ts`.

### Sizing and scaling

Lay out with **flexbox first** (`flex`, `gap`, percentages, `alignItems`). Scale only the numbers flexbox can't express. Spacing, radius and font tokens are already scaled; never scale a token again.

| Kind of size | Use | Why |
|---|---|---|
| Padding, margin, gap | `spacing` tokens | Moderately scaled: grows a little on bigger phones |
| Font size / line height | `<AppText variant>` (`typography`) | Moderately scaled; the system text-size setting is applied on top |
| Corner radius | `radius` tokens | Moderately scaled |
| Icon size | `moderateScale(n)` | Should grow a little, like text |
| Element **width** that should keep its share of the screen (image, card, avatar, carousel item) | `scale(n)` | Full width-based scaling |
| Element **height** tied to screen height (hero banner, bottom sheet) | `verticalScale(n)` | Full height-based scaling |
| Layout that depends on the current window (grid columns, responsive breakpoints) | `useWindowDimensions()` in the component | Updates on resize; the scaling helpers are read once at startup |
| Borders and separators | `1` or `StyleSheet.hairlineWidth` | Must stay thin; never scaled |
| Control sizes (buttons, inputs, icon buttons) | As per the Figma spec, built from tokens — don't add fixed minimum sizes | The design defines the size |
| Tap area of a small icon | Keep the icon at its Figma size and extend the tap area with `hitSlop` | Easier to hit without changing the design |

Text must stay accessible:

- Never set `allowFontScaling={false}` and never divide by `PixelRatio.getFontScale()`. Users who chose larger text must get it.
- Containers around text use padding and `minHeight`, not a fixed `height`, so they grow with larger text. Let labels wrap rather than truncate.
- Use `maxFontSizeMultiplier` (e.g. `1.3`) only on genuinely cramped UI such as tab-bar labels or badges, never app-wide.

## State management — which tool to use

Pick the **first** row that matches. Don't mix tools for the same piece of state.

| The state is… | Use | Where |
|---|---|---|
| Data the server owns (lists, profiles, anything fetched or saved) | React Query `useQuery` / `useMutation` | `src/features/<feature>/queries/` |
| A value computable from other state or props | Compute it during render (`useMemo` only if expensive) — never store it | — |
| One or two independent local values (toggle, selected tab, a single input) | `useState` | The component |
| Several related local values that change together, or the next state depends on the previous (forms, filters, wizards, multi-step flows) | `useReducer` with a typed action union | A `use<Thing>` hook in the feature's `hooks/` |
| Client state shared across screens (signed-in user, preferences, cart) | Zustand | `src/features/<feature>/store/<feature>Store.ts` |
| A value used only in handlers/effects and never rendered (timer id, previous value) | `useRef` | The component |

Rules:

- **Switch from `useState` to `useReducer`** when a component has 3+ `useState` calls that change together, or one handler calls several setters in a row.
- **Reducers** are pure: no API calls, navigation or other side effects. Type actions as a discriminated union (`{ type: 'changeField'; ... } | ...`) so the `switch` is exhaustive. Move the reducer and its `dispatch` helpers into a `use<Thing>` hook so the screen only sees values and named actions.
- **Never copy server data** into `useState` or Zustand, and never keep loading/error flags for API calls — React Query already tracks them.
- **Zustand**: one store per feature, client state only. Select just what you need (`useUserStore((s) => s.currentUserId)`), not the whole store.
- **Context** is for rarely changing values (theme, injected dependencies). Don't use it for state that changes often — every consumer re-renders.

Example — a filters reducer instead of three `useState` calls:

```ts
type FiltersState = { query: string; category: string | null; sort: 'newest' | 'price' };
type FiltersAction =
  | { type: 'setQuery'; query: string }
  | { type: 'setCategory'; category: string | null }
  | { type: 'reset' };

const initialFilters: FiltersState = { query: '', category: null, sort: 'newest' };

const filtersReducer = (state: FiltersState, action: FiltersAction): FiltersState => {
  switch (action.type) {
    case 'setQuery':
      return { ...state, query: action.query };
    case 'setCategory':
      return { ...state, category: action.category };
    case 'reset':
      return initialFilters;
  }
};
```

## SOLID principles (mandatory)

Apply SOLID to every change. Use the `clean-code-principles` skill as the reference; load it before designing a feature or reviewing code. In this codebase SOLID means:

- **S — Single Responsibility:** a screen lays out UI; server state goes in React Query hooks (`queries/`); client state in Zustand stores, `useReducer` hooks or `useState` (see the table above); HTTP in `services/`; validation goes in Zod schemas. If describing a component or function needs "and", split it.
- **O — Open/Closed:** extend shared components through props, variants and config maps — not by adding `if`/`switch` branches for each new caller.
- **L — Liskov Substitution:** a component wrapping a native element (e.g. `Input` wraps `TextInput`) must accept and forward the props it claims to support; variants of a component keep the same props contract.
- **I — Interface Segregation:** keep props and hook return values small; pass the values a component uses, not whole objects or stores.
- **D — Dependency Inversion:** components never call `fetch`, `axios`, `api` or services directly, and never read `process.env` — they depend on React Query hooks and `config/env`; query hooks depend on feature services, which depend on `services/api`. Pass dependencies in as parameters where it helps testing.

Pragmatism: SOLID serves readability. Prefer functions and hooks over classes, and don't add interfaces, classes or patterns that have only one use (YAGNI/KISS).

## Before finishing any task (required)

1. Run `npm run lint`, `npx tsc --noEmit` and `npm test`; fix what you introduced, and add or update tests for the code you changed.
2. Review every file you created or changed against the five principles above. Remove any comment that doesn't meet the **Comments** rule. Fix violations; if you leave one intentionally, justify it.
3. End your response with this report:

```
SOLID check
- S: ✅ | ⚠️ <file>: <issue and fix/justification>
- O: ✅ | ⚠️ ...
- L: ✅ | ⚠️ ...
- I: ✅ | ⚠️ ...
- D: ✅ | ⚠️ ...
```
