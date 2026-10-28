# AI notes

How I used AI to build pathwise in two days: the tools, the main prompts at each stage, and where the AI got it wrong.

## Tools

| Tool | Used for |
|---|---|
| **Claude (web) with the Figma skill** | Designing the app screens in Figma from my notes and screenshots of the reference app |
| **Figma agents** | Generating the design system: colours, type styles, spacing and radius tokens |
| **Claude Code (Claude Opus) in VS Code** | Generating the project from our React Native starter kit, then building, testing, reviewing and committing across the app, backend and database repos |
| **Expo, Callstack and clean-code skills** in `.claude/skills/` | Up-to-date Expo SDK 58 and React Native guidance, so the AI didn't rely on outdated training data |
| **Google Gemini** (in the product) | Reading uploaded resumes and filling in the profile |

## How AI was used at each stage

1. **Design:** Claude web with the Figma skill turned the screens I noted in the reference app into my own designs, with my own name, logo and content. Figma agents then built the design system from them.
2. **Project setup:** I asked Claude to generate the React Native project from our team's starter kit (Expo, TypeScript, React Query, i18n, theme folder, tests).
3. **Design system into code:** I gave Claude Code screenshots of the design system, and it filled in `colors.ts` (light and dark), `typography.ts`, `spacing.ts` and `radius.ts`.
4. **Project rules:** [AGENTS.md](AGENTS.md) holds the rules every change must follow: feature folders, theme tokens only, translations, validated API responses, tests, and a SOLID check after every task. Each feature keeps its decisions in a `spec/` folder, so the next session doesn't lose context.
5. **Backend and database:** I made the decisions; the AI laid out options with their trade-offs and did the work. It suggested the database, set up Serverless (Lambda), Terraform and Alembic, and walked me through the schema: tables, indexes, PostGIS for the map and pg_trgm for typo-tolerant search. I chose between the options, set limits on cost, and corrected it where it went the wrong way.
6. **Building features:** one feature at a time (sign-in, navigation, jobs map, jobs list and filters, resume parsing, language, splash), each tested on my phone, corrected with screenshots, then committed.
7. **Testing:** the AI wrote Jest and React Native Testing Library tests and ran lint, typecheck and tests after changes. I tested every screen on a real Android phone. For the map shaking under the keyboard, we recorded the screen with `adb` and measured how far the map moved each frame, until it was 0 px.
8. **Review:** after each task the AI checked its changes against SOLID and the project rules, and I read the diffs before every commit.

## Key prompts

Lightly cleaned up for typos, in the order I used them.

**Design system and setup**
- "I want to establish a design system in this project. I'll provide screenshots of the design system. Put the values in the matching files: `colors.ts`, `radius.ts`, `spacing.ts`, `typography.ts`. Wait until I give the screenshots."
- "Generate a professional commit message for the project initialisation and design system setup."

**Sign-in**
- "We want to add Google login via Amplify. Please guide me step by step."
- "I want a screen with an email option too. Keep the Apple button, but disabled."
- "Scroll up automatically when the next input is focused, until the login button is visible."
- "In other apps, Google sign-in opens a small account picker. Here it's a full-screen browser. Use the native picker."
- "While loading, the inputs and buttons should be disabled."
- "Create a `spec` folder in the auth feature with all the context, so we remember everything, and update AGENTS.md."

**Navigation and jobs map**
- "I'm planning to set up the header and bottom tabs. Give me a plan for how to structure the project."
- "I want a map with points for companies that have job posts. When I tap one, I see its job postings. Is that possible? Build it with dummy data first."
- "Under Jobs there are sections: Recommended, All Jobs, Saved, Applied. All Jobs has a map view and a list view. For now, create the tabs, the map view and the toggle."
- "Add zoom in, zoom out and focus on my current location." Then: "Can we add strong haptics on zoom, also when pinching? Is it good practice?"
- "Why is moderate scaling used? How does it help?"

**Backend and database** (my role here was making the decisions; the AI proposed and built)
- "I'm creating a backend for this app. Suggest the database type, with reasons." I chose PostgreSQL with PostGIS from its comparison.
- "This is just a demo app, so don't create costly databases." That ruled out bigger setups; we used the smallest RDS instance with a budget alert.
- When the AI asked how to version the backend and database, I chose two separate repos.
- "Create a separate database folder and initialise Alembic to maintain the schema." I wanted schema changes as reviewed migrations, not hand-run SQL.
- "Use Knex." I picked the query builder over raw SQL or an ORM for the jobs API.
- "Filters to support: verified, last 24 hours, nearby, aging (0–3, 3–7 days…), job title, skills, company, experience." The API was designed around these.
- "These values should come from env, right?" Terraform was holding the Cognito IDs as hard-coded values; it now reads them from the Amplify output.
- "If any secrets are in files, move them to env and gitignore it." I made the same call for the Gemini key: it lives only in AWS SSM.
- "We can use Bedrock, but what about cost? Go ahead with the low-cost option, and set limits." I set the cost limits: lightest model, page and size caps, daily limits per user and per app.
- "Is there any free API I can use?" When Bedrock was blocked, I chose the Gemini free tier, accepting that Google may use the data, which is noted as a gap before real users.
- "Make the parse limits configurable, and high on dev." I approved this when the daily limit got in the way of testing.
- "Use Amplify Hosting." With no domain of my own, I chose this to host the deep-link files for shared job links.

**Jobs list and filters**
- "I need the same design, with filters and search."
- "Create a shimmer for loading that looks the same as the component."
- "Keep the current design, but the filters should look like this" (with screenshots). Then: "Also a search bar inside each filter."
- "The quick filters should be these: Verified, Last 24 hours, Last week, Location…"

**Resume parsing**
- "Can I parse a PDF using AI and fill in the user's profile details? Give me the plan." Then: "Save this plan in the profile spec."
- "We can use Bedrock, but what about cost? Go ahead with the low-cost option, and set limits."
- "Is there any free API I can use?" (We chose the Gemini free tier.)
- "I always get error messages like 'file not valid' or 'busy'." Then: "Instead of an alert, do a nice UI."

**Polish**
- "When we share a job, the job ID should be in the link, so building the job view later is easier."
- "In the profile, add an option to change the language."
- "Implement a splash screen with a good animation, using the app logo, and request the required permissions there."
- "Create a README for all the repos. Simple and good."

## Where the AI got it wrong, and how I fixed it

**Main example: login tokens in the wrong storage.** In the auth spec, the AI planned to keep the sign-in tokens in AsyncStorage, the default for Amplify in React Native. AsyncStorage isn't encrypted, so anyone with access to the phone's files could read the tokens. I spotted it while reviewing the spec and told it: "Tokens shouldn't be in AsyncStorage. Store them in secure storage, and record the decision." They now go through `expo-secure-store` (Android Keystore and iOS Keychain), with a test for the case where Amplify writes several tokens at once, and the decision is written down in the [auth spec](src/features/auth/spec/decisions.md).

**Other examples:**
- **"Fixed" when it wasn't.** For Google sign-in flashing the screen, the AI said one setting fixed it. On the phone it still flashed. I replied "It's not fixed, use the native picker", and we switched to the native Google account picker.
- **Resume check rejected real resumes.** The AI asked the model "is this a resume?" before extracting anything, and the light model said no to real resumes. We replaced the question with a rule: a file counts as not a resume only if nothing could be extracted from it.
- **One error message for everything.** Every Gemini failure showed "busy", even for locked PDFs. Locked PDFs are now caught before the AI call, with their own message.
- **Bedrock assumption.** The AI planned resume parsing on Claude through AWS Bedrock. The account turned out to have zero quota. We checked the cost and limits, then moved to the Gemini free tier.
- **Keyboard covering a sheet.** The AI assumed the app's Android keyboard handling also covered pop-up sheets. It doesn't, because a pop-up is a separate window. I caught it on the device and we fixed it.
- **Formatter rewrote whole files.** A formatter run rewrote entire backend files, though only a few lines had changed. I spotted it in the diff, and we redid the change without the reformatting.

**What I learned:** the AI is fast, but its "done" isn't proof. I checked every change on the device and in the diff, and pushed back with screenshots when something wasn't right.
