# Jobs feature spec

The Jobs tab (`OpportunitiesScreen`) has four sections (`JobsSectionTabs`): Recommended, All Jobs, Saved, Applied. Only **All Jobs** is built: a map of companies with open jobs, with a location search bar (`LocationSearchBar`), zoom in/out and my-location buttons (`MapControls`) and a map/list toggle (`ViewModeToggle`; list view is a placeholder). Tapping a company pin opens a sheet with its job postings. The Jobs header has `ShareAppButton` (share sheet with an invite message; add a store link once the app is published). Data is **dummy** until the jobs API exists.

Sharing a job card sends `<EXPO_PUBLIC_WEB_URL>/jobs/<job id>`. That path opens the Jobs tab with a `jobId` route param (`navigation/linking.ts`), which a job-detail screen can read; nothing uses it yet.

## Setup: Google Maps key (Android)

The map uses `react-native-maps` (Google Maps on Android). Android crashes on opening the Jobs tab without a key.

1. Google Cloud console → same project as Google sign-in → **APIs & Services → Library** → enable **Maps SDK for Android**.
2. **Credentials → Create credentials → API key**. Restrict it to **Android apps** with the package name and SHA-1 used for the Google sign-in Android client (see the [auth setup](../../auth/spec/setup.md)), and to the **Maps SDK for Android** API.
3. Put it in `.env` as `GOOGLE_MAPS_ANDROID_API_KEY=...`. `app.config.ts` passes it to the `react-native-maps` config plugin, which writes it into the Android manifest.
4. Native change: `npm run build`.

iOS uses Apple Maps and needs no key.

## Location search

Search runs while typing: `usePlaceSearch` waits for a 600 ms pause (`useDebouncedValue`) and at least 3 characters, then `useSearchPlace(query)` (React Query, cached per query) → `locationService.searchPlace` → `expo-location` `geocodeAsync` (the phone's geocoder: free, no API key, no suggestions) → `acl/locationMapper` → `JobsMap` flies there and drops a brand pin. The pause matters: the geocoder fails when called too often.

- **Location permission comes first.** Android's geocoder only works after `requestForegroundPermissionsAsync`, so the first search shows the system prompt. Denied → "Allow location access to search places." The prompt text for iOS is `PERMISSIONS.location` in `app.config.ts`.
- **Errors** are `LocationError` codes. `notFound` is deliberately silent (the map just doesn't move); `permissionDenied` and `unknown` show `search.errors.<code>` under the bar.
- **Live suggestions** would need Google Places API (New), which is paid per request; not chosen yet.

## Map controls

- **Zoom** halves or doubles the visible area around the current centre through `JobsMap`'s handle (`ref` → `zoomBy`, `flyTo`).
- **My location:** `useCurrentLocation` (mutation, run on tap) → `locationService.getCurrentLocation` (permission, then `getCurrentPositionAsync`, balanced accuracy) → `flyTo`. After the first success the map shows the native blue dot (`showsUserLocation`); the native my-location button stays off because `MapControls` replaces it. Permission denied or no fix → an alert (`locate.errors.*`).

## Data flow

`useMapCompanies` / `useCompanyJobs` (React Query) → `jobsService` → `acl/jobsMapper` (Zod DTO → `MapCompany`, `JobPosting`).

- **Dummy data:** `services/dummyJobsData.ts` holds backend-shaped responses for coastal Karnataka companies; `jobsService` returns them after 400 ms. To switch to the API, replace `respond(...)` with `api.get(...)` and adjust `acl/jobs.dto.ts` to the real field names. Nothing outside `acl/` and `services/` changes.
- **Endpoints assumed:** a list of companies with `lat`, `lng` and `open_jobs_count`, and the jobs of one company. Confirm with the backend.

## Filters sheet

The list view's filter button opens `JobFiltersSheet` ("All Filters"): collapsible sections (`FilterSection`), one open at a time, each showing "Any", the chosen value or "N selected".

- **Sections:** Location (`cities`), Country, Job Title (`titles`), Company, Experience (one value), Aging (one posting-age bucket, shared with the quick-filter chips), Skills. Location, Job Title, Company and Skills come from `GET /jobs/filters` with job counts and have their own search box (`FilterOptionList`, filters the loaded options locally, shows at most 50).
- **Country is display-only ("India"):** all jobs are in India and the `jobs` table has no country column. Make it a real filter once the data has countries.
- **Draft, then apply:** the screen keeps the draft (`filtersDraft`); the sheet is controlled. While it is open, `useJobCount` asks `GET /jobs?pageSize=1` for the total with the draft applied (`withAdvanced`), so the button reads "Show N jobs". Nothing changes in the list until it is pressed.
- **Quick filters row** (`QuickFilters`): the filter button (opens the full sheet), toggles Verified / Last 24 hours / Last week (`lastWeek` = posted in the last 7 days), then dropdown chips Location, India, Job Title, Company, Aging, Skills (`useQuickFilterDropdowns`). A dropdown opens the sheet focused on that one filter (`focusSection`): its title, search and list, and Reset clears only that filter. India opens the full sheet, since Country is display-only. A chosen filter fills its chip and shows the value ("Pune") or a count ("Skills (2)").
- **Keyboard:** the sheet is a `Modal`, a separate Android window that `withAndroidImeInsets` doesn't pad, so it uses `KeyboardAvoidingView` with `padding` on both platforms. The single-filter sheet has a fixed height (`flex: 1` under a 10% backdrop) and only its list scrolls, so the search box stays put and the sheet doesn't shrink behind the keyboard as results narrow.
- **Backend:** `cities` and `titles` are exact-match comma lists; the options endpoint returns the 200 values with most open jobs per list.

## Decisions

- **`react-native-maps`, not `expo-maps`:** `expo-maps` is alpha in SDK 58 and has no marker clustering.
- **Clustering in JS with `supercluster`:** `useMapClusters` regroups companies on every `onRegionChangeComplete`. Pressing a group zooms to the level where it splits (`getClusterExpansionZoom`). Fine for hundreds of companies; with thousands, fetch clusters per visible area from the backend instead.
- **`PinMarker` stops `tracksViewChanges` after layout.** Android otherwise re-renders custom marker bitmaps every frame. The side effect is that a pin does not redraw when its content changes, so pins get new React keys instead (cluster keys include the count).
- **Light/dark map follows the phone theme by remounting.** Android reads `userInterfaceStyle` only when the map is created (its setter is a no-op in `react-native-maps`), so `JobsMap` keys `MapView` by the scheme and passes the last region as `initialRegion`.
- **Pin icon is the `jobs.svg` asset**, not Ionicons: an icon font may not have loaded when Android snapshots the marker.
- **The map doesn't resize with the keyboard (`KeyboardSteadyView`).** Google Maps re-centres on every resize, so shrinking it on each frame of the keyboard animation made it shake. It keeps the height it had with the keyboard closed, and the keyboard covers its bottom. A new height is accepted only after layout has been still for 300 ms with the keyboard closed: Android reports the keyboard hidden as it *starts* closing, and `Keyboard.isVisible()` can stay `false` after the keyboard reopens, so it also checks `useKeyboardVisible`. Verified on a device by recording the screen with `adb` and measuring map movement per frame (0 px).
- **Sections are a plain tab row, not swipeable top tabs:** a swipeable pager would fight with panning the map. Section and view mode are `useState` in the screen.
- **Sheet is a React Native `Modal`** (no bottom-sheet library yet). It isn't draggable; close with the backdrop, the close button or Back.
- **Jest:** `jest.setup.ts` replaces `react-native-maps` with a `View` and each `Marker` with a pressable button named by its `accessibilityLabel`. `mockAnimateToRegion` is exported from the mock.

## Not built yet

Recommended, Saved and Applied sections (and their counts), All Jobs list view, place suggestions while typing, filters job detail screen, company names next to pins, real API.
