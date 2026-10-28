# Profile feature spec

The Profile tab (`ProfileScreen`) shows the signed-in user's profile from `GET /profile`: summary card, resume card, Experience and Education. Guests see a sign-up prompt instead. The profile is filled by uploading a resume.

| File | What it covers |
|---|---|
| [resume-parsing.md](resume-parsing.md) | Upload a resume PDF; the backend fills the profile from it with Gemini (no review screen) |

## Map of the code

| Path | Responsibility |
|---|---|
| `screens/ProfileScreen.tsx` | Guest prompt, or loading / error / the profile cards and Sign out. Upload and download work; edit and add show "Coming soon" |
| `components/ProfileSummaryCard.tsx` | Initials avatar, name, email, current role, location, preferred work locations |
| `components/ResumeCard.tsx` | Resume file with upload and download buttons |
| `components/ProfileSectionCard.tsx` + `ProfileEntryItem.tsx` | One card type for Experience and Education; entries show a localised month range |
| `components/ProfileTitleBadge.tsx` | Profile code and plan badge next to the header title (wired through `TitleAccessory` in `TabNavigator`'s `TABS`) |
| `components/LanguageRow.tsx` + `LanguageSheet.tsx`, `hooks/useLanguagePicker.ts` | Language setting (signed in and guests): the row shows the current language, the sheet lists every language in `i18n` `resources`, each in its own script; the choice is saved by `changeLanguage` |
| `components/GuestProfilePrompt.tsx` | "Build your profile" with the Sign up button |
| `components/UploadResumeButton.tsx` | Header pill for signed-in users without a resume: starts the resume import; hidden once a resume is saved (replace it from the resume card) |
| `queries/useProfile.ts` | Loads the profile only when signed in (`skipToken` for guests) |
| `services/profileService.ts` | `GET /profile`, resume import and download (see [resume-parsing.md](resume-parsing.md)) |
| `acl/` | `ProfileResponseDtoSchema` (backend names, `YYYY-MM` months or null) → `toProfile`, plus the resume DTOs and error-code mapping |

## Decisions

- **One section card for Experience and Education.** Both map to `ProfileEntry` (`title`, `subtitle`, `startMonth`, `endMonth`, `description`), so a new section is a new mapping, not a new component.
- **Dates stay `YYYY-MM` until display.** `ProfileEntryItem` formats them with `Intl.DateTimeFormat` in the app language; a missing end month shows "Present", and the period is hidden when the resume gave no dates.
- **The resume file name is one line, shortened in the middle.** The project rule is to wrap text, but a file name wrapped mid-word was unreadable on a device; middle truncation keeps the extension visible.
- **Solid avatar instead of the design's gradient.** A gradient needs `expo-linear-gradient` (native module + rebuild).
- **The backend's `guest` plan is `free` in the app.** The title badge shows the plan, and "Guest" next to a signed-in user read as "not signed in"; the mapper renames it, so the database enum stays as it is.
- **No header pill on Profile** (`hidesPrimaryAction` in `TABS`), matching the design.

## Not built yet

Editing, adding entries, deleting the resume, avatar photo, updated profile tests.
