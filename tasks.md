## Push repo [COMPLETED]
Acceptance:
- Re-read GUIDELINES.MD AND PROJECT_SPEC.MD

## Feature: Header, Title, Footer [COMPLETED]
### 0.1 Add a good looking modern header and footer to the app [COMPLETED]
### 0.2 Add a title to the app. Title should be in the header [COMPLETED]

## Feature: FR.1 — Upload a product image [COMPLETED]
(See [tasks/task-fr1-upload-product-image.md](tasks/task-fr1-upload-product-image.md))

## Feature: FR.2 — Specify number of type of images to generate [COMPLETED]
### FR.2.1 — Ability to specify how many images generated should be lifestyle shots [COMPLETED]
### FR.2.2 — Ability to specify how many images generated should be hero shots [COMPLETED]
### FR.2.3 — Ability to specify how many images generated should be close-ups [COMPLETED]
### FR.2.4 — Ability to specify how many images generated should be flat lay shots [COMPLETED]
### FR.2.5 — Ability to specify how many images generated should be macro/detail shots [COMPLETED]
### FR.2.6 — Ability to specify how many images generated should be contextual shots [COMPLETED]
### FR.2.7 — Ability to specify how many images generated should be themed environment shots [COMPLETED]
Acceptance:
- Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- User can specify the count for themed environment shots in the UI.
- The backend correctly handles themed environment shots and generates them using the thematic setting description.

## Feature: UI Refinement - Shots Selection Gap [COMPLETED]
The Fix (TDD):
- [x] RED: Added failing test `ShotTypeGap.test.tsx` to verify vertical alignment and gap constraint.
- [x] GREEN: Updated `ShotTypeItem` in `App.tsx` to use `justify-between` for vertical alignment and `max-w-3xl` to reduce the horizontal gap.
- [x] RED: Added failing test `Whitespace.test.tsx` to verify further width reduction to `max-w-xl`.
- [x] GREEN: Reduced `max-w-3xl` to `max-w-md` in `ShotTypeItem` and set `w-fit` on `ShotsSelection` card to eliminate trailing horizontal whitespace.
- [x] Verified all tests passing.
- [x] Removed temporary test files as requested (cosmetic fix).

## Feature: FR.3 — Specify which image will be used as the Primary Etsy image [COMPLETED]
The Fix (TDD):
- [x] RED: Added failing unit test for `setPrimaryImage` in `useListingGeneration.test.ts`.
- [x] RED: Added failing UI integration test in `ListingGenerationUI.test.tsx`.
- [x] GREEN: Added `isPrimary?: boolean` to `ListingImage` interface.
- [x] GREEN: Implemented `setPrimaryImage(index)` in `useListingGeneration` hook.
- [x] GREEN: Added "Set as Primary Etsy Image" checkbox in `ListingPreview.tsx`.
- [x] REFACTOR: Reduced gap in listing preview items using TDD (changed `gap-2` to `gap-1`).
- [x] REFACTOR: Added additional test case for removing primary image to ensure state consistency.
- [x] Verified all 73 tests passing.

## Feature: FR.3 — Upload a background for product image [COMPLETED]
Acceptance:
- Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [COMPLETED] Background upload buttons moved to Shots Selection list.
- [COMPLETED] Buttons placed to the right of the plus button with 10px padding.
- [COMPLETED] Background Uploads section removed.

## Feature: UI Enhancement [COMPLETED]
### Align "Generate Listing Images" button to center [COMPLETED]
Acceptance:
- [x] "Generate Listing Images" button is centered horizontally relative to the Shots Selection section.
- [x] Status and error messages associated with generation are also aligned with the button.

### Reduce Shot Type counter width [COMPLETED]
Acceptance:
- [x] The counter input in Shots Selection is shortened for a more compact UI.
- [x] Verified existing UI tests pass.

## Feature: UI Refinement - Auto-scroll to Listing Preview [COMPLETED]
(See [tasks/task-fr16-auto-scroll.md](tasks/task-fr16-auto-scroll.md))

## Feature: FR.4 — Show a final preview of the listing images [COMPLETED]
(See [tasks/task-fr4-listing-preview.md](tasks/task-fr4-listing-preview.md))

## Task: Fix [COMPLETED]
### Resolve 500 error and SyntaxError when clicking generate listing images button
The Fix:
- [COMPLETED] Improved backend error handling in `src/service/app.ts` to ensure JSON responses.
- [COMPLETED] Updated `src/client/repositories/ListingRepository.ts` to validate response status before parsing JSON.
- [COMPLETED] Added explicit error re-throwing in `src/service/data/GeminiImageGenerator.ts`.
- [COMPLETED] Resolved `TypeError: images.map is not a function` in `ListingPreview.tsx` by correctly extracting images array from response in `useListingGeneration.ts`.
- [COMPLETED] Verified fix with full test suite (31 passing tests).

## Task: Fix [COMPLETED]
### Resolve 403 Forbidden error in integration tests by correctly loading environment variables
The Fix:
- [COMPLETED] Installed `dotenv` to manage environment variables.
- [COMPLETED] Initialized `dotenv.config()` in `src/service/app.ts` to ensure `GEMINI_API_KEY` is loaded from `.env`.
- [COMPLETED] Verified that all tests, including the real Gemini integration test, pass successfully.

## Task: Fix [COMPLETED]
### Resolve broken image in the UI from the response
The Fix:
- [COMPLETED] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [COMPLETED] Updated `GeminiImageGenerator.ts` to use `picsum.photos` for more reliable placeholder URLs.
- [COMPLETED] Enhanced `ListingPreview.tsx` with an `onError` handler and fallback image (`placehold.co`) for better resilience.
- [COMPLETED] Updated tests to verify the new image URL format.
- [COMPLETED] All tests pass (41 passing tests).

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
### Ensure all individual production API calls timeout at 15 seconds
The Fix:
- [COMPLETED] Implemented 15s timeout for Gemini API calls in `src/service/data/GeminiImageGenerator.ts` using `RequestOptions`.
- [COMPLETED] Created `fetchWithTimeout` utility in `src/client/lib/utils.ts` to enforce a 15s timeout on `fetch` calls.
- [COMPLETED] Updated `ListingRepository.ts` (client) to use `fetchWithTimeout` for image generation and prompt previews.
- [COMPLETED] Updated `useListingGeneration.ts` to use `fetchWithTimeout` for clipboard and ZIP operations.
- [COMPLETED] Reduced image counts in integration tests to 1 image to ensure they fit within the 15s Jest and API timeout limits.
- [COMPLETED] Updated `README.md` to document the new 15s API reliability standard.
- [COMPLETED] Verified `AbortError` triggers correctly at 15s for Gemini calls.

## Task: Fix [COMPLETED]
### Ensure system prompt is always returned and displayed
The Fix:
- [COMPLETED] Updated `ListingRepository` (server) to pre-populate `systemPrompt` from preview logic.
- [COMPLETED] Updated `ListingController` (server) to include `systemPrompt` in error responses.
- [COMPLETED] Updated `ListingRepository` (client) to extract `systemPrompt` from error responses and attach it to thrown errors.
- [COMPLETED] Updated `useListingGeneration` hook (client) to set `systemPrompt` even when an error occurs.
- [COMPLETED] Added backend logging to `ListingRepository` to track requested shot counts.
- [COMPLETED] Added integration and unit tests to verify prompt persistence during zero-shot and error scenarios.

## Task: Fix [COMPLETED]
### Ensure ZIP download contains only valid images and no HTML pages
The Fix:
- [COMPLETED] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [COMPLETED] Update `downloadAllImagesAsZip` to validate response status and content type.
- [COMPLETED] Handle failed image fetches by using a fallback or skipping.
## Task: Fix [COMPLETED]
### Resolve broken image caused by double data-URL prefixing
The Fix:
- [COMPLETED] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [COMPLETED] Implemented `toDataUrl` to robustly handle base64 data that may already contain a protocol prefix.
- [COMPLETED] Refactored `extractImageFromResponse` and `findImageDeep` to use `toDataUrl`, preventing double-prefixing.
- [COMPLETED] Added regression test case for pre-prefixed data.
- [COMPLETED] Verified fix with full test suite (57 tests).
- [COMPLETED] Verified no linting or runtime errors.


## Feature: FR.5 — Redesign certain images that I don't like [NOT STARTED]
Acceptance:
- Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
### FR.5.1 — Select an image to regen - create a new one [NOT STARTED]
### FR.5.2 — Clicking the refresh button creates a new image [NOT STARTED]

## Feature: FR.6 — Reorder or arrange ordering of images [NOT STARTED]
Acceptance:
- Re-read GUIDELINES.MD AND PROJECT_SPEC.MD

## Feature: FR.7 — Remove images [COMPLETED]
Acceptance:
- Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
### FR.7.1 — Ability to Remove uploaded image [COMPLETED]
### FR.7.2 — Ability to remove a listing image from the list of images [COMPLETED]

## Feature: FR.14 — Download generated images [COMPLETED]
Acceptance:
- [COMPLETED] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
### FR.14.1 — Download individual generated images directly [COMPLETED]
### FR.14.2 — Download all generated images as a ZIP file [COMPLETED]

## Feature: FR.8 — Fill out other listing fields [NOT STARTED]
(See [tasks/task-fr8-listing-fields.md](tasks/task-fr8-listing-fields.md))

## Feature: FR.9 — Save Listing Draft [NOT STARTED]
Acceptance:
- Re-read GUIDELINES.MD AND PROJECT_SPEC.MD

## Feature: FR.10 — Publish Listing [NOT STARTED]
Acceptance:
- Re-read GUIDELINES.MD AND PROJECT_SPEC.MD

## Feature: FR.11 — Push the new listing to my etsy store [NOT STARTED]
Acceptance:
- Re-read GUIDELINES.MD AND PROJECT_SPEC.MD

### FR.11.1 — Technical Notes [NOT STARTED]

## Feature: FR.12 — Custom Context for Shot Types [COMPLETED]
Acceptance:
- [COMPLETED] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [COMPLETED] Ability to add specific instructions for each shot type via a "+" icon.
- [COMPLETED] Instructions are appended to the system prompt.
- [COMPLETED] Custom context textbox should be multiline, longer horizontally by default and draggable horizontally.

## Feature: FR.13 — System Prompt Preview Pane [COMPLETED]
Acceptance:
- [COMPLETED] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [COMPLETED] Ability to see the final system prompt in a side pane.
- [COMPLETED] Side pane is resizable.

## Task: Fix [COMPLETED]
### Resolve 404 error when clicking generate listing images button
The Fix:
- [COMPLETED] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [COMPLETED] Created `src/service/index.ts` to start the backend Koa server.
- [COMPLETED] Configured Vite proxy in `vite.config.ts` to forward `/listings` requests to the backend.
- [COMPLETED] Updated `package.json` to run both frontend and backend concurrently in `dev` mode.
- [COMPLETED] Ensured environment variables are loaded at the earliest possible stage in `src/service/index.ts`.

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
### Remove 'prompt' parameter from GeminiImageGenerator and internalize prompts
The Fix:
- [COMPLETED] Moved shot type prompts from `ListingRepository` to `GeminiImageGenerator`.
- [COMPLETED] Updated `GeminiImageGenerator.generateImage` to internalize prompt selection.
- [COMPLETED] Updated all callers and tests to match the new signature without the `prompt` parameter.
- [COMPLETED] Removed "Nano Banana" identity from system prompt as it is not necessary.
- [COMPLETED] All primary backend and integration tests pass.

## Task: DRY Refactoring of ListingRepository [COMPLETED]
### Refactor duplicated image generation functions into a single generic function
The Fix:
- [COMPLETED] Updated `GUIDELINES.md` with rule `Q1.9` to enforce DRY principles.
- [COMPLETED] Refactored `src/service/repositories/ListingRepository.ts` to replace duplicated shot-type functions with `generateShotTypeImages`.
- [COMPLETED] Verified all tests pass and application starts without errors.

## Task: Fix [COMPLETED]
### Resolve hanging integration test 'generates images using gemini'
The Fix:
- [COMPLETED] Added 50-second timeout to Gemini API calls to stay within Jest's 60s timeout.
- [COMPLETED] Protected `findImageDeep` against infinite recursion by adding circular reference detection (using a Set) and a depth limit of 10.
- [COMPLETED] Improved error logging in `GeminiImageGenerator` to better diagnose API issues like 503 Overloaded.
- [COMPLETED] Verified that tests now finish and report errors correctly instead of hanging indefinitely.

## Task: Documentation [COMPLETED]
### Update README.md with project-specific information and recent changes
The Fix:
- [COMPLETED] Renamed project to "Etsy Listing Generator".
- [COMPLETED] Documented image generation strategy (Gemini 3 Pro + Imagen 4 fallback).
- [COMPLETED] Documented UI enhancements (System Prompt pane, status feedback).
- [COMPLETED] Documented technical architecture (Onion architecture, functional modules).
- [COMPLETED] Documented testing infrastructure (15s timeout).

## Task: Refactor [COMPLETED]
### Use concise domain prose for test names
The Fix:
- [COMPLETED] Renamed technical test names to concise domain prose (e.g., "gets system prompt") in `PromptPreview.test.ts`.

## Task: Fix [COMPLETED]
### Ensure error messages are visible and correctly positioned
The Fix:
- [COMPLETED] Fixed a bug in `useListingGeneration.ts` where `error` and `isGenerating` states were not returned by the hook.
- [COMPLETED] Moved the error message display in `App.tsx` from above to below the "Generate Listing Image" button.
- [COMPLETED] Added unit tests for `useListingGeneration` hook to verify error state handling (primary failure and fallback).
- [COMPLETED] Added UI integration test `ListingGenerationUI.test.tsx` to verify error message visibility and positioning.
- [COMPLETED] Verified fix with all client-side tests passing.

## Task: UI Enhancement [COMPLETED]
### Display shot type below each image in Listing Preview
The Fix:
- [COMPLETED] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [COMPLETED] Updated `ListingPreview.tsx` to display shot type in small, light yellow text (`text-yellow-200`).
- [COMPLETED] Modified `useListingGeneration.ts` to manage images as `{ url, type }` objects.
- [COMPLETED] Updated server-side `ListingRepository.ts` to associate each generated image with its specific shot type.
- [COMPLETED] Adjusted all relevant tests across frontend and backend to align with the new image data structure.
- [COMPLETED] Increased global test timeout to 60s in `jest.config.js` to ensure stability for real API integration tests.
- [COMPLETED] Verified fix with all tests passing and no linting errors.

## Task: Fix [COMPLETED]
### Resolve broken image in the UI
The Fix:
- [COMPLETED] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [COMPLETED] Refactored `extractImageFromResponse` to prioritize `inlineData` and clean base64 strings.
- [COMPLETED] Enhanced URL validation to only accept text links with image extensions.
- [COMPLETED] Switched to more reliable placeholder and fallback services (`picsum.photos`, `placehold.co`).
- [COMPLETED] Verified fix with new unit tests and full test suite.
- [COMPLETED] Verified no linting or runtime errors.

## Task: Fix [COMPLETED]
### Ensure image generation retries with the next model on any model failure
The Fix:
- [COMPLETED] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [COMPLETED] Broadened `isRetryableError` in `ListingRepository` to include 5xx, 429, and common error strings.
- [COMPLETED] Updated `useListingGeneration.test.ts` to verify client-side retry orchestration.
- [COMPLETED] Verified fix with full test suite (55 tests).

## Task: Persistence [COMPLETED]
### Persist generated images in assets/generated-images
The Fix:
- [x] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [x] Updated `src/service/lib/assetManager.ts` to use `assets/generated-images` directory.
- [x] Updated URL paths returned by server to `/assets/generated-images/`.
- [x] Cleaned up old `assets/generated` directory.
- [x] Updated integration tests to support the new image URL format.
- [x] Verified that images are correctly saved and served from the new directory.

## Task: Fix [COMPLETED]
### Resolve broken image caused by metadata extraction
The Fix:
- [COMPLETED] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [COMPLETED] Updated `extractImageFromResponse` and `findImageDeep` in `GeminiImageGenerator.ts` to strictly require `image/` mime type for `inlineData`.
- [COMPLETED] Added regression test in `GeminiImageGeneratorExtraction.test.ts`.
- [COMPLETED] Verified fix with full test suite (56 tests).

## Task: Fix [COMPLETED]
### Ensure browser opens automatically on yarn dev
The Fix:
- [COMPLETED] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [COMPLETED] Updated `vite.config.ts` to include `server.open: true`.
- [COMPLETED] Verified configuration.

## Task: Fix [COMPLETED]
### Resolve 'body stream already read' error when custom context is added
The Fix:
- [COMPLETED] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [COMPLETED] Fix `ListingRepository` (client) to read response body only once.
- [COMPLETED] Investigated backend failure and confirmed client-side error handling was the primary issue.

## Task: Fix [COMPLETED]
### Resolve timeouts and 500 errors when generating multiple images
The Fix:
- [COMPLETED] Set primary model to `gemini-2.5-flash-image` and fallback to `imagen-4.0-generate-001`.
- [COMPLETED] Increased client-side API timeout to 180s in `src/client/lib/utils.ts`.
- [COMPLETED] Added robust retry logic with exponential backoff (up to 2 retries per image) in `ListingRepository.ts` for 503/429 errors.
- [COMPLETED] Enabled concurrent image generation (within shot types) while protecting with retries.
- [COMPLETED] Increased integration test timeout to 300s to accommodate multiple generations.
- [COMPLETED] Verified fix with `FourLifestyleShots.test.ts` passing successfully in 17.8s with real API calls.

## Task: FR.15 [COMPLETED]
(See [tasks/task-fr15-context-templates.md](tasks/task-fr15-context-templates.md))

## Task: Fix [COMPLETED]
### Resolve ReferenceError: templates is not defined in App.tsx
The Fix:
- [x] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [x] Create a reproduction test in `ListingGenerationUI.test.tsx`.
- [x] Fix the missing `templates` and `onSaveTemplate` in `ShotTypeItem` destructuring in `App.tsx`.
- [x] Verify the fix with tests.

## Task: Fix [COMPLETED]
### Ensure template selection populates custom context without duplication
The Fix:
- [x] Fixed backend duplication in `ListingRepository` by matching prompt instructions while ignoring count differences.
- [x] Updated `App.tsx` to append template text to custom context and avoid duplicate strings.
- [x] Verified fix with new test cases in `ListingGenerationUI.test.tsx` and manual verification.
- [x] All 70 tests passing.
