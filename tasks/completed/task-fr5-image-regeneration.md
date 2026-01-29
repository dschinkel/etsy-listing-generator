## Feature: FR.5 — Redesign certain images that I don't like [COMPLETED]
Acceptance:
- [x] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
### FR.5.1 — Ability to add specific custom context to an existing generated image via a "+" button [COMPLETED]
### FR.5.2 — Ability to regenerate a single image using its specific custom context via a "Regenerate" button [COMPLETED]
### FR.5.3 — The regenerated image replaces the original image in the Listing Preview [COMPLETED]

Implementation Details:
- **UI Scaffold**: Added `Plus` and `RefreshCw` buttons to `ListingPreview.tsx`. Toggled textarea for custom context and a smaller regenerate button.
- **Hook Layer (TDD)**: Added `regenerateImage` to `useListingGeneration.ts`. Verified with unit tests that it calls the repository and replaces the image in the state.
- **Repository (Client) (TDD)**: Added `generateSingleImage` to `ListingRepository.ts` to hit the new backend endpoint.
- **Backend (TDD)**:
  - Created `GenerateSingleImage` command.
  - Updated service-layer `ListingRepository` to support single image generation.
  - Added `generateSingle` endpoint to `ListingController` and wired it in `app.ts`.
- **Integration**: Connected UI buttons to the hook in `App.tsx`.

## PR.5 Fix [COMPLETED]
### Uncaught ReferenceError: regenerateImage is not defined
The Fix:
- [x] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [x] Added `regenerateImage` to the `useListingGeneration` destructuring in `App.tsx`.
- [x] Updated `useListingGeneration` hook to track `modelUsed` during single image regeneration.
- [x] Verified that all tests pass.

## PR.5 Fix [COMPLETED]
### Model tracking and UI layout for regeneration
The Fix:
- [x] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [x] Updated `useListingGeneration` hook to track `regeneratingIndex` during regeneration.
- [x] Extracted `ModelStatus` component to `src/client/components/ModelStatus.tsx` for reusability.
- [x] Moved the `Regenerate` button in `ListingPreview.tsx` to be always visible above the primary checkbox.
- [x] Integrated `ModelStatus` into `ListingPreview.tsx` to show the model used specifically for the image being regenerated.
- [x] Updated `App.tsx` to use the shared `ModelStatus` component and avoid duplicate displays during regeneration.
- [x] Verified with unit and UI tests (56 core tests passing).

## PR.5 Fix [COMPLETED]
### Custom context inclusion in regeneration system prompt
The Fix:
- [x] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [x] Verified that `ListingRepository.ts` (service) passes `customContext` to `dataLayer.generateImage`.
- [x] Verified that `GeminiImageGenerator.ts` includes `customContext` in the system prompt.
- [x] Added a regression test in `GeminiImageGenerator.test.ts` to ensure `customContext` is present in `systemInstruction`.
- [x] Confirmed DRY principles are followed as both generation flows share the same prompt builder.
