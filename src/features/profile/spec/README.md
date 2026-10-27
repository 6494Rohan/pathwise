# Profile feature spec

The Profile tab (`ProfileScreen`) shows the signed-in user's profile: summary card, resume card, Experience and Education. Guests see a sign-up prompt instead. Data is **dummy** until the profile API exists.

| File | What it covers |
|---|---|
| [resume-parsing.md](resume-parsing.md) | Plan (not built): fill the profile from an uploaded resume PDF using Claude |

## Map of the code

| Path | Responsibility |
|---|---|
| `screens/ProfileScreen.tsx` | Guest prompt, or loading / error / the profile cards and Sign out. Edit, add, upload and download show "Coming soon" |
| `components/ProfileSummaryCard.tsx` | Initials avatar, name, email, current role, location, preferred work locations |
| `components/ResumeCard.tsx` | Resume file with upload and download buttons |
| `components/ProfileSectionCard.tsx` + `ProfileEntryItem.tsx` | One card type for Experience and Education; entries show a localised month range |
| `components/ProfileTitleBadge.tsx` | Profile code and plan badge next to the header title (wired through `TitleAccessory` in `TabNavigator`'s `TABS`) |
| `components/GuestProfilePrompt.tsx` | "Build your profile" with the Sign up button |
| `components/UploadResumeButton.tsx` | Header pill for signed-in users (placeholder) |
| `queries/useProfile.ts` | Loads the profile only when signed in (`skipToken` for guests) |
| `services/profileService.ts` + `dummyProfileData.ts` | Dummy backend-shaped response after 400 ms. To switch to the API, replace `respond(...)` with `api.get(...)` |
| `acl/` | `ProfileResponseDtoSchema` (backend names, `YYYY-MM` dates) → `toProfile` |

## Decisions

- **One section card for Experience and Education.** Both map to `ProfileEntry` (`title`, `subtitle`, `startMonth`, `endMonth`, `description`), so a new section is a new mapping, not a new component.
- **Dates stay `YYYY-MM` until display.** `ProfileEntryItem` formats them with `Intl.DateTimeFormat` in the app language; a missing end month shows "Present".
- **The resume file name is one line, shortened in the middle.** The project rule is to wrap text, but a file name wrapped mid-word was unreadable on a device; middle truncation keeps the extension visible.
- **Solid avatar instead of the design's gradient.** A gradient needs `expo-linear-gradient` (native module + rebuild).
- **No header pill on Profile** (`hidesPrimaryAction` in `TABS`), matching the design.

## Not built yet

Real profile API, editing, adding entries, resume upload and download, resume parsing ([plan](resume-parsing.md)), avatar photo.
