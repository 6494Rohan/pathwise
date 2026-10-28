# pathwise

A small job-discovery app for Android and iOS, built with AI, with its own backend and sample data.

You sign in, browse jobs on a map or in a searchable list, filter them, and upload your resume to fill in your profile automatically.

## The three repos

| Repo | What it holds |
|---|---|
| [pathwise](https://github.com/6494Rohan/pathwise) (this one) | The mobile app: Expo / React Native, TypeScript |
| [pathwise-backend](https://github.com/6494Rohan/pathwise-backend) | REST API (AWS Lambda), sign-in (Cognito), infrastructure (Terraform). Details in its [README](https://github.com/6494Rohan/pathwise-backend#readme) |
| [pathwise-database](https://github.com/6494Rohan/pathwise-database) | PostgreSQL schema, migrations (Alembic) and the sample-data script. Details in its [README](https://github.com/6494Rohan/pathwise-database#readme) |

```
App (Expo) ──► API Gateway ──► Lambda (TypeScript) ──► PostgreSQL on RDS (PostGIS, pg_trgm)
   │                              ├─► S3 (resume PDFs)
   └─► Cognito (sign-in)          └─► Google Gemini (resume parsing)
```

## What works

- **Sign-in:** email and password (with sign-up) or Google, through AWS Cognito. Guests can browse jobs without an account.
- **Jobs, map view:** companies with open jobs as pins, grouped when zoomed out. Place search, zoom and "my location" controls. Tapping a pin lists that company's jobs.
- **Jobs, list view:** search (title, company, city or skill, typo-tolerant), endless scrolling and sort (newest, oldest, salary). Quick filters: Verified, Last 24 hours, Last week, and one-tap dropdowns for Location, Job Title, Company, Aging and Skills. The full filter sheet shows a live "Show N jobs" count. Jobs can be shared as a link.
- **Profile:** upload a resume PDF. The backend reads it with Gemini and fills in name, role, location, experience, education and skills, with clear error messages and daily limits. The resume can be downloaded again.
- **Settings:** English and Hindi, saved on the device. Light and dark mode follow the phone.
- **Splash screen:** animated logo, and it asks for location and notification permission on first launch.

## What is missing

- **Job detail screen.** Shared links already carry the job id (`/jobs/<id>`), but the screen that opens one isn't built yet.
- The Recommended, Saved and Applied sections, and the Skills and Learning tabs, are placeholders. Saving a job says "coming soon".
- Profile fields can't be edited by hand; they come from the resume.
- Country is display-only ("India"): the sample data has no other countries.
- Some tests are out of date. The profile tests and a few jobs screen tests still expect the old dummy data, so `npm test` currently fails. Lint and typecheck pass.
- Sample data is 150 generated jobs (`database/scripts/seed_dev_jobs.py`), not real listings.

## Tech choices

| Choice | Why |
|---|---|
| **Expo (SDK 58) + React Native, TypeScript** | One codebase for Android and iOS, fast builds, good AI tool support |
| **React Navigation, React Query, Zustand, Zod** | Navigation, server data with caching and retries, a little shared client state, and validation of every API response |
| **i18next** | English and Hindi, with each feature owning its strings |
| **AWS Lambda + API Gateway (Serverless Framework)** | No servers to run, pay per request |
| **PostgreSQL on RDS with PostGIS and pg_trgm** | Distance and map queries, and typo-tolerant search, inside the database |
| **Cognito (Amplify Gen 2)** | Email and Google sign-in without building auth myself |
| **Terraform + Alembic** | Infrastructure and schema changes are code, reviewed and repeatable |
| **Google Gemini, free tier** | Resume parsing at no cost. Claude on AWS Bedrock was the first choice but was blocked on this AWS account |

The app keeps backend names out of its UI: every API response is checked and translated in one place per feature (`acl/`), so a backend rename changes one file.

## Run it

You need Node 22, an Android phone or emulator, an AWS account, and Python 3 for the database.

1. **Sign-in:** clone the three repos side by side. In `backend`, run `npm install`, then `npm run sandbox`. This creates Cognito and writes `amplify_outputs.json` into this repo.
2. **Infrastructure and API:** follow the [backend README](https://github.com/6494Rohan/pathwise-backend#readme) (`npm run tf:apply`, store the Gemini key in SSM, then `npm run deploy:api`). RDS costs about US$15–18 a month.
3. **Database:** follow the [database README](https://github.com/6494Rohan/pathwise-database#readme) (`alembic upgrade head`, then `scripts/seed_dev_jobs.py` for sample jobs).
4. **App:** in this repo:
   ```bash
   npm install
   # .env: EXPO_PUBLIC_API_URL (from deploy:api), EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
   #       GOOGLE_MAPS_ANDROID_API_KEY, EXPO_PUBLIC_WEB_URL (for share links)
   npm run build        # installs a development build on the connected Android device
   npm start            # dev server
   ```
   For a release APK: `npm run build:apk`. The file is in `android/app/build/outputs/apk/release/`.

The app uses native modules (maps, Google sign-in, secure storage), so it doesn't run in Expo Go.

Checks: `npm run lint`, `npx tsc --noEmit`, `npm test`.

## How I used AI

Design in Figma with Claude (web) and the Figma skill, a design system generated by Figma agents, and the project generated from our starter kit. Then Claude Code built, tested and reviewed the app, backend and database, following the rules in [AGENTS.md](AGENTS.md). Tools, key prompts and the mistakes I caught are in [AI_NOTES.md](AI_NOTES.md).

Each feature's decisions and setup are in its `spec/` folder, for example [jobs](src/features/jobs/spec/README.md), [profile](src/features/profile/spec/README.md) and [auth](src/features/auth/spec/README.md).
