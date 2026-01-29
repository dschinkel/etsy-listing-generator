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
