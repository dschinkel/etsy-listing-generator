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
