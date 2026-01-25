# Etsy Listing Generator

## AGENTS.md
`AGENTS.md` is checked by the agent at the start of every session
Why this is a "Force Multiplier" for your workflow:

**Standardization**: Because AGENTS.md is an open standard, if you ever use a CLI tool (like Codex) to run a "Full-Auto" refactor, it will see this checklist and execute it as a final validation step.

**Context Control**: By using the @ mentions, you're signaling to Junie's Brave mode exactly which files are high-priority. It reduces the chance of the AI ignoring your guidelines in favor of generic "AI-style" code.
- In the context of AI coding agents like Junie, Codex, or Cursor, an @ mention is a special syntax used to explicitly "attach" a file, folder, or documentation to the conversation.

**The "Seeding" Benefit**: Since you use a repo to seed new apps, having this AGENTS.md in your boilerplate ensures that every new project inherits these exact quality controls. You won't have to set up Junie's project settings every single time; it will "discover" these rules automatically.

## @ Mentions
Whenever you want to tell Junie or a tool to look at a file use `@` so that it prioritizes it over other files. e.g. `please read @GUIDELINES.md`
It tells the agent's Context Loader to fetch that file every single time a new task starts

How to use them in JetBrains/Junie:
Open the Junie chat.

Type `@`.

Select your `PROJECT_SPEC.md`.

Type your request.

## How this was Bootstrapped
- First, read the README.md in `react-app-boilerplate`
  - Junie (in Brave mode) or Codex will read AGENTS.md, see that it's a new project without the Tailwind config, and say: "I noticed the project isn't initialized. I'm running the sync script first."
  - `react-app-boilerplate` repo contains a shell script that utilizes uses rsync, which is the industry standard for "smart" merging
  - After we use the bootstrapped code in a new app, whenever we want to update the bootstrap (make react-app-boilerplate smarter or provide more), by having the `sync-boilerplate.sh` script in `react-app-boilerplate`'s AGENTS.md rule, you can just tell the agent: "Update the boilerplate in this project," and it will run the sync script, bringing in only the new improvements while leaving your app code untouched
  - By keeping the `AGENTS.md` updated, you ensure that Junie (in Brave mode) or Codex knows it has the green light to run this script whenever it detects the project is uninitialized

### If using Junie
- Junie (in Brave mode) reads the AGENTS.md first. Therefore it'll also bootstrap this project automatically if it hasn't already
  - Silent Execution: It will perform the copy and the merge as part of its "Plan" phase before it ever touches your SVG code.
  - also If you accidentally delete a vital config file while working, the agent will notice the "Bootstrap Check" is no longer met and restore the missing piece from the boilerplate repo automatically.
- Context Loading: When you start a new session, Junie reads AGENTS.md. It sees the @ mentions and immediately pulls those three files into its "active memory."
- Conflict Resolution: If Junie suggests a "clever" solution that violates your GUIDELINES.md, you can simply say, "Check the guidelines again," and it will correct itself because you've explicitly defined that file as the manual.
- Task Discipline: By making tasks.md a "Mandatory Log," Junie will stop trying to do 5 things at once and stay focused on the specific task you’ve assigned in your iterative loop.
