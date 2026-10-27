# Resume parsing (plan, not built)

Goal: the user uploads a resume PDF and the app pre-fills their profile (name, contact, location, experience, education, skills) using Claude, then lets them review it before saving.

## Rules

- **The AI call runs on the backend, never in the app.** An API key shipped in the app can be extracted from the bundle. The key lives in an Amplify secret used by a Lambda.
- **Nothing is saved without review.** Extraction is usually right but can get dates or titles wrong; the user edits a pre-filled form and confirms.
- **The PDF is data, not instructions.** A resume can contain text aimed at the model; the request uses a fixed JSON schema so the reply can only fill our fields.

## Flow

```
App: pick PDF → upload to S3 (resumes/{userId}/)
   → call parseResume(fileKey)                   Amplify Data custom mutation, Cognito auth
Lambda: read PDF from S3 → Claude with a JSON schema
   → validate with Zod → return a draft          nothing saved
App: "Review your details" (pre-filled, editable)
   → confirm → save profile
```

## Phases

### 1. Backend (Amplify Gen 2)

- **Storage:** `defineStorage` with a per-user path, `resumes/{entity_id}/*`, readable and writable only by its owner.
- **Profile data:** Amplify Data models for Profile, Experience and Education. This replaces `dummyProfileData.ts`; it's needed for real saving anyway.
- **Lambda `parseResume`:**
  1. Set up with `defineFunction` and exposed as a custom mutation for signed-in users.
  2. Secret: `npx ampx sandbox secret set ANTHROPIC_API_KEY`.
  3. Reads the PDF from S3 and sends it as a document block (`type: "document"`, base64, `media_type: "application/pdf"`) through `@anthropic-ai/sdk`.
  4. Sets `output_config.format` to a JSON schema covering name, email, phone, location, current role, experience, education and skills.
  5. Validates the result with Zod and returns it. A `refusal` stop reason or invalid JSON returns a typed error.
- **Model:** `claude-opus-5-5` at `effort: "low"` (plain extraction). `claude-haiku-5-5` is much cheaper; pick between them with the accuracy check in phase 4.

### 2. App

- **File picker:** `expo-document-picker`, PDF only, ≤ 5 MB. Native module: needs `npm run build`.
- **Upload:** Amplify `uploadData`, with progress shown on `ResumeCard`.
- **Parsing:** `queries/useParseResume.ts` (mutation) → `services/profileService.parseResume` → `acl/` maps the Lambda result to a `ProfileDraft`.
- **Review screen:** an editable form pre-filled from the draft (`useReducer` form hook, like the auth forms). Confirming saves the profile and invalidates `profileKeys.me()`.
- **Entry points:** the header Upload Resume pill and the upload button on `ResumeCard`.

### 3. Safety and privacy

- **Limits:** file size, page count, and parses per user per day, so one user can't run up costs.
- **Personal data:** don't log resume contents or extracted fields. Let users delete the file and their data. Add a line in the upload flow saying the resume is processed by an AI service.
- **Anthropic retention:** API data isn't used for training by default. Check Anthropic's current commercial terms for retention, and zero-data-retention eligibility if needed.

### 4. Tests and quality

- **Unit tests:** the Lambda with the Anthropic SDK and S3 mocked (same pattern as the auth Lambdas' tests); the app hook, mapper and review screen.
- **Accuracy check:** run 15–20 real, anonymised resumes (including scanned PDFs) through it and score each field. This decides between Opus and Haiku.

## Rough cost per resume

Estimates from list prices for a 1–2 page resume, to be measured in phase 4.

| Model | Per resume | 10,000 resumes |
|---|---|---|
| Claude Opus 5.5 ($4 / $20 per M tokens) | ~$0.03–0.08 | ~$300–800 |
| Claude Haiku 5.5 ($0.10 / $0.50 per M tokens) | ~$0.001–0.003 | ~$10–30 |

## Open decisions

1. **Keep the PDF** after parsing, as the downloadable resume on the card, or delete it once the details are extracted?
2. **Review before saving** (recommended), or fill the profile automatically?
3. **Anthropic account:** who owns the API key for the backend?
4. **Order:** move Profile from dummy data to Amplify Data first, or start with parsing that returns a draft only?
