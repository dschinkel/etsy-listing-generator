## Feature: FR.21 — Archive Uploaded Images [COMPLETED]
Acceptance:
- [x] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [x] TDD `archiveProductImage(index)` in `useProductUpload`
- [x] Ability to archive uploaded images to `./src/assets/uploads`

The Implementation (TDD):
- [x] RED: Added failing unit test for `archiveProductImage` in `useProductUpload.test.ts`.
- [x] GREEN: Implemented `archiveProductImage` in `useProductUpload.ts`.
- [x] GREEN: Updated `ListingRepository` (client) to support `target` parameter.
- [x] GREEN: Updated `assetManager.ts` to support archiving to `src/assets/uploads`.
- [x] REFACTOR: Extracted individual archiving logic into reusable methods.
- [x] Verified all tests passing.

### FR.21.3 — Prevent duplicate archiving of uploaded images [COMPLETED]
- [x] RED: Added test to `useProductUpload.test.ts` verifying that `archiveProductImage` tracks the archived status.
- [x] GREEN: Implement tracking using `archivedInSession` state (Set).
- [x] REFACTOR: Keep the tracking logic clean.
- [x] Disable archive button in `App.tsx` (UploadedImage) if image is archived
