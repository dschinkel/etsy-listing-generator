## Feature: FR.20 — Archive Listing Images [COMPLETED]
Acceptance:
- [x] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [x] TDD `archiveAllImages` at the hook layer (`useListingGeneration.ts`).
- [x] Create `ArchiveListingImages` command and service layer repository method.
- [x] Implement file copying from `src/assets/generated-images` to `src/assets/archived-images`.
- [x] Add "Archive All" button in `ListingPreview.tsx`.
- [x] Verify that archived images persist after clearing generated images.

### FR.20.4 — Ability to archive an individual listing image [COMPLETED]
- [x] RED: Added failing unit test for `archiveImage` in `useListingGeneration.test.ts`.
- [x] GREEN: Implemented `archiveImage` in `useListingGeneration.ts`.
- [x] GREEN: Updated `ListingPreview.tsx` UI with individual archive buttons.
- [x] REFACTOR: Extracted individual archiving logic into reusable methods.
- [x] Verified all tests passing.

### FR.20.5 — Prevent duplicate archiving of listing images [COMPLETED]
- [x] RED: Added test to `useListingGeneration.test.ts` verifying that `archiveImage` sets an `isArchived` flag.
- [x] GREEN: Update `archiveImage` and `archiveAllImages` to set `isArchived: true`.
- [x] REFACTOR: Ensure state updates are efficient.
- [x] Disable archive button in `ListingPreview` if image is archived

### FR.20.1 — Backend Archive Logic [COMPLETED]
- [x] Create `src/service/commands/ArchiveListingImages.ts`.
- [x] Update `src/service/repositories/ListingRepository.ts` with `archiveImages`.
- [x] Update `src/service/lib/assetManager.ts` with `archiveImageFiles`.
- [x] Add route to `src/service/app.ts`.

### FR.20.2 — Frontend Hook TDD [COMPLETED]
- [x] RED: Failing test in `useListingGeneration.test.ts`.
- [x] GREEN: Implement `archiveAllImages`.
- [x] REFACTOR: Cleanup.

### FR.20.3 — UI Integration [COMPLETED]
- [x] Add button to `ListingPreview.tsx`.
- [x] Wire up button in `App.tsx`.
