# PulseCheck

PulseCheck is a mobile-web based polling system with real-time data responses collected from users! It is accessible to anyone who wishes to create quizzes or polls and provides automated performance tracking. This ensures that both hosts and users receive fast feedback, allowing for a proper gauge of a participant's understanding of the material being presented.

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
- Node.js installed (recommended version: 22.x or later)
- Corepack enabled (run `corepack enable`)
  - On Windows, you may have to run your terminal as administrator in order to enable corepack. 
- Yarn installed globally (run `npm install -g yarn` if not installed)


### Installation
1. Clone the repository:
   ```bash
   git clone git@github.com:Camputron/New-PulseCheck.git
   ```
2. Navigate to the project directory:
    ```bash
    cd pulsecheck
    ```
3. Install dependencies
    ```bash
    yarn install
    ```
## Development Scripts
The following scripts are available in `package.json`:

- `yarn dev`: Starts the app for development.
- `yarn test`: Runs test scripts using [Vitest](https://vitest.dev/)
- `yarn build`: Builds the app for production.
- `yarn lint`: Checks source code quality using ESLint.
- `yarn format`: Formats source code using Prettier.
- `yarn format:check`: Lists source files that do not follow the project's configured format rules.
- `yarn preview`: Previews the project's production build.
