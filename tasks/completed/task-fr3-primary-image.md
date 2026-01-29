### FR.3.2 — Ability to mark a single generated image as the Primary Etsy Image [COMPLETED]
Acceptance:
- [x] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [x] Only one can be primary.
- [x] Add this feature.
- [x] TDD this feature.

The Implementation (TDD):
- [x] RED: Added failing unit test for `setPrimaryImage` in `useListingGeneration.test.ts`.
- [x] RED: Added failing UI integration test in `ListingGenerationUI.test.tsx`.
- [x] GREEN: Added `isPrimary?: boolean` to `ListingImage` interface.
- [x] GREEN: Implemented `setPrimaryImage(index)` in `useListingGeneration` hook.
- [x] GREEN: Added "Set as Primary Etsy Image" checkbox in `ListingPreview.tsx`.
- [x] REFACTOR: Reduced gap in listing preview items using TDD (changed `gap-2` to `gap-1`).
- [x] REFACTOR: Added additional test case for removing primary image to ensure state consistency.
- [x] Verified all 73 tests passing.
