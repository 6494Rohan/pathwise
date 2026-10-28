# Resume parsing

The user uploads a resume PDF and the backend fills their profile from it with Google Gemini (`gemini-3.5-flash-lite`, free tier). There is **no review screen**: the parsed details are saved straight into the profile and the screen updates.

## Flow

```
App: Upload (ResumeCard or header pill) → expo-document-picker (PDF, ≤ 5 MB checked locally)
  → POST /profile/resume/upload-url              presigned S3 POST for resumes/{sub}/{uuid}.pdf
  → POST to S3 (multipart, no auth header)       uploadToPresignedPost in services/api.ts
  → POST /profile/resume/parse { file_key, file_name }   35 s timeout
Backend: daily limit check → read PDF from S3 (PDF, ≤ 5 MB, ≤ 4 pages)
  → Gemini (inline PDF + JSON schema, low thinking) → zod validation
  → clean + save profile, experience, education, skills → delete the previous PDF
App: setQueryData(profileKeys.me(), profile) → green "Profile updated" banner in the resume card
```

Download: `GET /profile/resume/download-url` returns a 5-minute link, opened with `Linking.openURL`. It is fetched on every tap (a mutation, not a query) because the link expires.

## Map of the code

| Path | Responsibility |
|---|---|
| `hooks/useResumeImport.ts` | Opens the picker, checks the size, runs the import; returns the latest `result` (imported / failed + code) until dismissed |
| `queries/useImportResume.ts` | The import mutation, keyed so `useIsImportingResume` and `useLastResumeImport` (React Query mutation state) work on every screen, whichever button started it |
| `components/ResumeNotice.tsx` | Success / error banner inside the resume card, with a dismiss button; replaces alerts |
| `queries/useResumeDownload.ts` | Gets a fresh download link |
| `services/profileService.ts` | `importResume` (upload link → S3 → parse), `getResumeDownload`; turns API errors into `ResumeError` codes |
| `acl/` | DTOs for profile, upload link, download link and the error body; `toResumeErrorCode` maps backend codes (`parse_limit`, `too_many_pages`…) to ours |
| `components/ResumeCard.tsx` | Spinner, "Reading your resume…" and a time hint while importing; the notice banner; AI notice under the file |
| `components/UploadResumeButton.tsx` | Header pill; same flow, disabled while importing |

The backend side (routes, limits, key setup) is in the backend repo's README.

## Decisions

- **The AI call runs on the backend.** The app never talks to Gemini; the API key is an SSM SecureString given only to the parse Lambda.
- **Gemini free tier, not Claude:** Claude on Bedrock is blocked on this AWS account (0 quota), and the free tier costs nothing. Google may use free-tier content to improve its products, so switch to a paid key before real users.
- **No review screen** (product decision). The backend keeps a stored value when the resume doesn't state it, and replaces experience, education and skills with the resume's.
- **The PDF is kept** as the downloadable resume; uploading a new one deletes the old file, and a failed parse deletes its upload.
- **Encrypted PDFs are refused before the AI call** (`locked` error): Gemini rejects them, and many Canva or LinkedIn exports are permission-locked. Re-saving or printing to a new PDF fixes it.
- **No up-front "is this a resume?" question.** The light model said no to real resumes; a file counts as not a resume only when nothing (name, experience, education, skills) could be extracted.
- **Low cost:** the lightest model with low thinking, 5 MB / 4 page limit, 3 parses per user and 100 per app per day, and an AWS budget alert. Failed parses count towards the limit so retries can't run up cost.
- **The resume is untrusted.** The model is told to ignore instructions inside it, and the reply can only fill a fixed schema.
- **Name and email come from the resume.** The Cognito access token has no email claim, so an empty profile shows "Add your name" / "N/A" until a resume is imported.

## Not built yet

Editing the profile by hand, deleting the resume and profile data, an accuracy check on real resumes, and updated tests for the profile feature (`acl`, `screens` and `services` tests still expect the old dummy data).
