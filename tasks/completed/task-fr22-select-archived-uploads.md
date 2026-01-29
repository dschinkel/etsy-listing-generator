## Feature: FR.22 — Select Archived Uploads [COMPLETED]
Acceptance:
- [x] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [x] FR.22.1 — Collapsible section showing archived photos
- [x] FR.22.2 — Select up to 2 archived images
- [x] FR.22.3 — Preview selected archived images
- [x] FR.22.4 — TDD at hook layer

## PR.22 Fix [COMPLETED]
### Archived images not included in generation request
The Fix:
- [x] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [x] Added `resolveLocalImageUrl` to `assetManager.ts` to convert local paths to base64.
- [x] Updated `ListingRepository.ts` (service) to resolve reference images and backgrounds before generation.
- [x] Verified with integration test `ArchivedContextImage.test.ts`.
