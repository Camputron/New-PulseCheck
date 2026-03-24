# PulseCheck

PulseCheck is a mobile-web based polling system with real-time data responses collected from users! It is accessible to anyone who wishes to create quizzes or polls and provides automated performance tracking. This ensures that both hosts and users receive fast feedback, allowing for a proper gauge of a participant's understanding of the material being presented.

---

## Table of Contents
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Development](#development)
  - [Running with Firebase Emulators](#running-with-firebase-emulators-recommended)
  - [Running against Production Firebase](#running-against-production-firebase)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
  - [Web App](#web-app-project-root)
  - [Cloud Functions](#cloud-functions-firebasefunctions)
- [Production Deployment Setup](#production-deployment-setup)
- [TODO](#todo)

---

## Features
- Create and manage quizzes or polls
- Collect real-time responses
- Automated performance tracking for quizzes
- Instant feedback for hosts and users
- Mobile and web-friendly interface

---

## Getting Started
To run PulseCheck locally, follow the steps below:

### Prerequisites
- Node.js (v24.x or later)
- Java (v21 or later) — required for the Firestore emulator
- Corepack enabled (run `corepack enable`)
  - On Windows, you may have to run your terminal as administrator in order to enable corepack.
- Yarn (run `npm install -g yarn` if not installed)
- Firebase CLI (run `npm install -g firebase-tools` if not installed)

### Installation
1. Clone the repository:
   ```bash
   git clone git@github.com:Camputron/New-PulseCheck.git
   ```
2. Navigate to the project directory:
    ```bash
    cd PulseCheck
    ```
3. Install app dependencies:
    ```bash
    yarn install
    ```
4. Install Cloud Functions dependencies:
    ```bash
    cd firebase/functions && npm install && cd ../..
    ```
5. Build Cloud Functions:
    ```bash
    cd firebase/functions && npm run build && cd ../..
    ```

---

## Development

### Running with Firebase Emulators (Recommended)

This runs the app against local Firebase emulators instead of the production project. All data stays on your machine.

1. Create a `.env.local` file in the project root:
    ```
    VITE_USE_EMULATORS=true
    ```

2. Start the Firebase emulators (Terminal 1):
    ```bash
    firebase emulators:start
    ```
    This starts emulators for Auth (`:9099`), Functions (`:5001`), Firestore (`:8080`), Hosting (`:5050`), and Storage (`:9199`). The Emulator UI is available at `http://localhost:4000`.

3. Start the Vite dev server (Terminal 2):
    ```bash
    yarn dev
    ```
    The app runs at `http://localhost:5173` and connects to the local emulators.

### Running against Production Firebase

If you don't need emulators, just run the dev server directly. Make sure `.env.local` does **not** contain `VITE_USE_EMULATORS=true` (or delete the file).

```bash
yarn dev
```

---

## Project Structure

```
PulseCheck/
├── src/                        # React app source
│   ├── components/             # UI components by feature
│   ├── pages/                  # Route-level pages
│   │   ├── auth/               # Login, Register, GetStarted
│   │   ├── poll/               # Poll editor, session, results, history
│   │   └── legal/              # Privacy, Terms, Contributors
│   ├── api/firebase/           # Firebase API stores
│   ├── contexts/               # React Contexts
│   ├── hooks/                  # Custom hooks
│   ├── providers/              # Context providers
│   ├── styles/                 # Theme configuration
│   ├── types/                  # TypeScript types
│   └── utils/                  # Utility functions
├── firebase/
│   ├── functions/              # Cloud Functions (separate Node.js project)
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── config/                 # Firebase rules and indexes
│       ├── firestore.rules
│       ├── firestore.indexes.json
│       └── storage.rules
├── .github/workflows/          # CI/CD pipelines
├── firebase.json               # Firebase project configuration
└── .env.local                  # Local env overrides (git-ignored)
```

---

## Scripts

### Web App (project root)

| Command              | Description                                    |
|----------------------|------------------------------------------------|
| `yarn dev`           | Start the Vite dev server                      |
| `yarn build`         | Production build                               |
| `yarn lint`          | Run ESLint                                     |
| `yarn format`        | Format source code with Prettier               |
| `yarn format:check`  | Check formatting without writing               |
| `yarn preview`       | Preview the production build                   |
| `yarn test`          | Run tests with Vitest                          |

### Cloud Functions (`firebase/functions/`)

| Command              | Description                                    |
|----------------------|------------------------------------------------|
| `npm run build`      | Compile TypeScript to `lib/`                   |
| `npm run build:watch`| Compile and watch for changes                  |
| `npm run lint`       | Run ESLint on functions source                 |
| `npm run serve`      | Build and start the Functions emulator         |
| `npm run deploy`     | Deploy functions to production                 |
| `npm run logs`       | View Cloud Functions logs                      |

---

## Production Deployment Setup

If you need to re-setup the CI/CD pipeline from scratch (new Firebase project, new repo, or lost secrets), follow these steps.

### 1. Firebase Project

The Firebase project is `new-pulsecheck`. Ensure the following services are enabled in the [Firebase Console](https://console.firebase.google.com/project/new-pulsecheck):
- Authentication (Email/Password, Google, Anonymous)
- Cloud Firestore
- Cloud Storage
- Cloud Functions
- AI Logic (Gemini)

### 2. Create a Service Account for GitHub Actions

1. Go to [Google Cloud Console > IAM & Admin > Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts?project=new-pulsecheck)
2. Create a new service account (or use the existing `github-action-*@new-pulsecheck.iam.gserviceaccount.com`)
3. Generate a JSON key and download it

### 3. Assign IAM Roles to the Service Account

Go to [IAM & Admin > IAM](https://console.cloud.google.com/iam-admin/iam?project=new-pulsecheck) and grant the service account these roles:

| Role | Purpose |
|------|---------|
| **Firebase Hosting Admin** | Deploy hosting artifacts |
| **Cloud Functions Admin** | Deploy Cloud Functions |
| **Firebase Rules Admin** | Deploy Firestore and Storage security rules |
| **Service Account User** | Required for Cloud Functions deployment |
| **Cloud Build Editor** | Cloud Functions uses Cloud Build internally |

### 4. Add GitHub Repository Secrets

Go to **GitHub Repo > Settings > Secrets and variables > Actions** and add:

| Secret Name | Value |
|-------------|-------|
| `FIREBASE_SERVICE_ACCOUNT_NEW_PULSECHECK` | The full JSON key file contents from step 2 |

> `GITHUB_TOKEN` is provided automatically by GitHub Actions — no setup needed.

### 5. CI/CD Pipelines

Two workflows exist in `.github/workflows/`:

**`firebase-deploy-pr.yml`** — Runs on pull requests to `main`:
- Builds and lints the app and Cloud Functions
- Starts all Firebase emulators (Auth, Functions, Firestore, Hosting, Storage)
- Verifies each emulator boots and responds
- No production deploy — emulator validation only

**`firebase-deploy.yml`** — Runs on merge to `main`:
- Builds the app and Cloud Functions
- Deploys Hosting to the live channel
- Deploys Cloud Functions
- Deploys Firestore rules and indexes
- Deploys Storage rules

### 6. Manual Deployment

To deploy from the command line:

```bash
# Login to Firebase
firebase login

# Deploy everything
firebase deploy --project new-pulsecheck

# Deploy individual services
firebase deploy --only hosting --project new-pulsecheck
firebase deploy --only functions --project new-pulsecheck
firebase deploy --only firestore --project new-pulsecheck
firebase deploy --only storage --project new-pulsecheck
```

---

## TODO
- [ ] Set up shared types directory (`shared/types/`) for Firestore data model interfaces used by both the web app (`src/lib/types/`) and Cloud Functions (`firebase/functions/`)
