## Feature: FR.13 — System Prompt Preview Pane [COMPLETED]
Acceptance:
- [COMPLETED] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [COMPLETED] Ability to see the final system prompt in a side pane.
- [COMPLETED] Side pane is resizable.

### Task Details:
- Implemented `SystemPromptPane` in `App.tsx` with horizontal resizability and mono-spaced display.
- Exposed `systemInstruction` through `ListingRepository` and `GenerateListingImages` command.
- Added `systemPrompt` state and exposure in `useListingGeneration.ts` hook.
- Verified data propagation and UI layout.
- Updated integration tests to accommodate the new response structure.
