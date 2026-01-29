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

## Task: Fix [COMPLETED]
### Resolve 500 error when clicking generate listing images and add System Prompt pane to UI
The Fix:
- [COMPLETED] Updated `GeminiImageGenerator.ts` to return placeholder and system prompt on empty API response.
- [COMPLETED] Exposed `systemInstruction` through `ListingRepository` and `GenerateListingImages` command.
- [COMPLETED] Added `systemPrompt` state and exposure in `useListingGeneration.ts` hook.
- [COMPLETED] Implemented `SystemPromptPane` in `App.tsx` with horizontal resizability and mono-spaced display.
- [COMPLETED] Verified data propagation and UI layout.
- [COMPLETED] Updated integration tests to accommodate the new response structure.
- [COMPLETED] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [COMPLETED] Refactored all server-side and client-side classes to functional modules using factory functions.
- [COMPLETED] Updated `GUIDELINES.md` to strictly forbid the use of classes and mandate the functional module pattern.

## Task: Fix [COMPLETED]
### Resolve 404 or empty response for /listings/system-prompt
The Fix:
- [COMPLETED] Added request logging middleware to `src/service/app.ts` for better server diagnostics.
- [COMPLETED] Standardized `koa-bodyparser` initialization for better ESM/CJS interop.
- [COMPLETED] Refactored router to use prefix `/listings` and improved route matching.
- [COMPLETED] Updated Vite proxy to use `127.0.0.1` for more reliable local resolution.
- [COMPLETED] Added a health check endpoint and a catch-all 404 route with detailed logging.
- [COMPLETED] Verified fix with real-server tests and integration tests.

## Task: Fix [COMPLETED]
### Ensure system prompt is always returned and displayed
The Fix:
- [COMPLETED] Updated `ListingRepository` (server) to pre-populate `systemPrompt` from preview logic.
- [COMPLETED] Updated `ListingController` (server) to include `systemPrompt` in error responses.
- [COMPLETED] Updated `ListingRepository` (client) to extract `systemPrompt` from error responses and attach it to thrown errors.
- [COMPLETED] Updated `useListingGeneration` hook (client) to set `systemPrompt` even when an error occurs.
- [COMPLETED] Added backend logging to `ListingRepository` to track requested shot counts.
- [COMPLETED] Added integration and unit tests to verify prompt persistence during zero-shot and error scenarios.
