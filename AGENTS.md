## Core Project Documentation
Treat the following files as the authoritative sources for project state and behavior:

- **Source of Truth:** `@PROJECT_SPEC.md`
    - Consult this first to understand feature requirements, technical stack, and design goals.

- **Behavioral & Style Manual:** `@GUIDELINES.md`
    - **Mandatory:** Follow all coding standards, architectural patterns, and naming conventions defined here.
    - Check this file before refactoring or implementing new logic to ensure compliance with project norms.

- **Mandatory Progress Log:** `@tasks.md`
    - This is the ledger for all active and completed work.
    - **Rule:** Before beginning work, identify the relevant task ID.
    - **Rule:** Upon completing a piece of behavior, update this file immediately with a status change and brief summary.

## Project Setup & Bootstrapping
Before performing any feature work or refactoring, ensure the project environment is initialized:

- **Bootstrap Check:** If the project root lacks the standard scaffolding (e.g., missing `src/components/common` or `tailwind.config.js`), execute the following initialization:
  - **Action:** Execute `../react-app-boilerplate/sync-boilerplate.sh`.
  - **Goal:** Establish baseline scaffolding while preserving existing, newer files in this repo.
  - **Verification:** Confirm that `package.json` now includes the standard boilerplate scripts.
- Initialize the repository and push it up to the remote repo as a new repository using the github cli

## Git & Remote Automation
- **Auto-Sync:** After completing any task in `tasks.md`, verify the project is in a clean state and push the current branch to GitHub.
- **Repository Setup:** If the local repo is not linked to GitHub, create a new remote repository named `[current-folder-name]` and perform the initial push.
- 
## Agent Behavioral Rules (Self-Review)
Before finalizing any task, you must perform a self-audit against the following checklist:

1. **Guideline Compliance:** Does the code strictly follow the patterns in `GUIDELINES.md`? (e.g., naming, file structure, error handling).
2. **Spec Alignment:** Does the implementation fulfill the specific requirements in `PROJECT_SPEC.md` without adding "gold-plating" (unrequested features)?
3. **No Regressions:** Did you ensure that existing logic or boilerplate functionality remains intact?
4. **Documentation Sync:** Did you update `tasks.md` to reflect the current state of this behavior?
5. **Clean Up:** Remove all temporary logs, `TODO` comments, or unused imports introduced during the iteration.

## Continuous Integration (Brave Mode Only)
- **Auto-Commit:** After completing any behavior that modifies files, perform a local commit with a descriptive message.
- **Auto-Push:** If the session is successful and tests pass, push the current branch to the remote origin.
