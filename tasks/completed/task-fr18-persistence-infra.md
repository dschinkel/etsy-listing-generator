## Feature: FR.18 — Persistence and Infrastructure [COMPLETED]

### FR.18.1 — Persist generated images in `src/assets/generated-images` [COMPLETED]
Acceptance:
- [x] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [x] Updated `src/service/lib/assetManager.ts` to use `src/assets/generated-images` directory.
- [x] Updated URL paths returned by server to `/src/assets/generated-images/`.
- [x] Cleaned up old `assets/generated-images` directory.
- [x] Updated integration tests to support the new image URL format.
- [x] Verified that images are correctly saved and served from the new directory.

### FR.18.2 — Broadened retryable error detection [COMPLETED]
Acceptance:
- [x] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [x] Broadened `isRetryableError` in `ListingRepository` to include 5xx, 429, and common error strings.
- [x] Updated `useListingGeneration.test.ts` to verify client-side retry orchestration.
- [x] Verified fix with full test suite (55 tests).

### FR.18.3 — Enforce 15-second timeout for individual production API calls [COMPLETED]
Acceptance:
- [x] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [x] Implemented 15s timeout for Gemini API calls in `src/service/data/GeminiImageGenerator.ts` using `RequestOptions`.
- [x] Created `fetchWithTimeout` utility in `src/client/lib/utils.ts` to enforce a 15s timeout on `fetch` calls.
- [x] Updated `ListingRepository.ts` (client) to use `fetchWithTimeout` for image generation and prompt previews.
- [x] Updated `useListingGeneration.ts` to use `fetchWithTimeout` for clipboard and ZIP operations.
- [x] Reduced image counts in integration tests to 1 image to ensure they fit within the 15s Jest and API timeout limits.
- [x] Updated `README.md` to document the new 15s API reliability standard.
- [x] Verified `AbortError` triggers correctly at 15s for Gemini calls.

### FR.18.4 — Image Storage Migration & Deletion [COMPLETED]
Acceptance:
- [x] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [x] Migrate `GENERATED_ASSETS_DIR` to `src/assets/generated-images`.
- [x] Ensure `assetManager.ts` correctly deletes files from the new directory.
- [x] Verify deletion on uploaded product image removal.
- [x] Verify deletion on listing preview image removal.
- [x] Verify deletion on "Clear All" images.
