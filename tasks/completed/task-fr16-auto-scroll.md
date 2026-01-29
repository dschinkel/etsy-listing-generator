## Feature: UI Refinement - Auto-scroll to Listing Preview [COMPLETED]
Acceptance:
- [x] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [x] Upon completion of image generation, the page automatically scrolls to the Listing Preview section.
- [x] Scrolling is smooth and only happens when new images are successfully generated.

## PR.16 Fix [COMPLETED]
### clicking the generate listing images button is not auto scrolling me to the top of the page.
The Fix:
- [x] Added `leftPaneRef` and `middlePaneRef` to `App.tsx`.
- [x] Updated "Generate Listing Images" button handler to use `scrollTo({ top: 0, behavior: 'smooth' })` on the pane refs.
- [x] This bypasses `window.scrollTo` which was ineffective in the fixed three-pane layout.

### Increase the size of the text in each section of Shots Selection [COMPLETED]
Acceptance:
- [COMPLETED] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [COMPLETED] Labels in `ShotTypeItem` increased to `text-base font-semibold`.
- [COMPLETED] Descriptions in `ShotTypeItem` increased to `text-sm`.
- [COMPLETED] Verified UI changes manually.

### Make shot type headers yellow [COMPLETED]
Acceptance:
- [COMPLETED] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [COMPLETED] Labels in `ShotTypeItem` updated to `text-yellow-200`.
- [COMPLETED] Verified UI changes manually.
