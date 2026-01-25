# Etsy Listing Generator

## AGENTS.md
Why this is a "Force Multiplier" for your workflow:

**Standardization**: Because AGENTS.md is an open standard, if you ever use a CLI tool (like Codex) to run a "Full-Auto" refactor, it will see this checklist and execute it as a final validation step.

**Context Control**: By using the @ mentions, you're signaling to Junie's Brave mode exactly which files are high-priority. It reduces the chance of the AI ignoring your guidelines in favor of generic "AI-style" code.

**The "Seeding" Benefit**: Since you use a repo to seed new apps, having this AGENTS.md in your boilerplate ensures that every new project inherits these exact quality controls. You won't have to set up Junie's project settings every single time; it will "discover" these rules automatically.

### If using Junie
- Context Loading: When you start a new session, Junie reads AGENTS.md. It sees the @ mentions and immediately pulls those three files into its "active memory."
- Conflict Resolution: If Junie suggests a "clever" solution that violates your GUIDELINES.md, you can simply say, "Check the guidelines again," and it will correct itself because you've explicitly defined that file as the manual.
- Task Discipline: By making tasks.md a "Mandatory Log," Junie will stop trying to do 5 things at once and stay focused on the specific task you’ve assigned in your iterative loop.
