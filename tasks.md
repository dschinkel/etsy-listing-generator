## Push repo [COMPLETED]
Acceptance:
- Re-read GUIDELINES.MD AND PROJECT_SPEC.MD

## Feature: Header, Title, Footer [COMPLETED]
### 0.1 Add a good looking modern header and footer to the app [COMPLETED]
### 0.2 Add a title to the app. Title should be in the header [COMPLETED]

## Feature: FR.1 — Upload a product image [COMPLETED]
(See [tasks/completed/task-fr1-upload-product-image.md](tasks/completed/task-fr1-upload-product-image.md))
### FR.1.4 — Multiple Reference Images [COMPLETED]
- [x] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [x] FR.1.4.1 — Ability to upload up to 2 reference context images
- [x] FR.1.4.2 — Send both images to the AI model
- [x] FR.1.4.3 — UI updates for dual image support

## Feature: FR.2 — Specify number of type of images to generate [COMPLETED]
(See [tasks/completed/task-fr2-image-counts.md](tasks/completed/task-fr2-image-counts.md))
### FR.2.8 — Clear counts after generation request [COMPLETED]

## Feature: UI Refinement - Shots Selection Gap [COMPLETED]
(See [tasks/completed/task-ui-refinement-shots-gap.md](tasks/completed/task-ui-refinement-shots-gap.md))

## Feature: FR.3 — Specify which image will be used as the Primary Etsy image [COMPLETED]
(See [tasks/completed/task-fr3-primary-image.md](tasks/completed/task-fr3-primary-image.md))

## Feature: FR.17 — Background Upload for Shot Types [COMPLETED]
(See [tasks/completed/task-fr17-background-upload.md](tasks/completed/task-fr17-background-upload.md))

## Feature: UI Enhancement [COMPLETED]
(See [tasks/completed/task-ui-enhancement.md](tasks/completed/task-ui-enhancement.md))

## Feature: UI Refinement - Auto-scroll to Listing Preview [COMPLETED]
(See [tasks/completed/task-fr16-auto-scroll.md](tasks/completed/task-fr16-auto-scroll.md))
### FR.16.4 — Scroll to top on generation request [COMPLETED]
- [x] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [x] Implement scroll to top logic in `App.tsx` button handler.

## Feature: FR.4 — Show a final preview of the listing images [COMPLETED]
(See [tasks/completed/task-fr4-listing-preview.md](tasks/completed/task-fr4-listing-preview.md))
### FR.4.7 — Relocate AI model status message to top left of Listing Preview [COMPLETED]

## PR.0 Fix [COMPLETED]
(See [tasks/completed/task-pr0-meta-fixes.md](tasks/completed/task-pr0-meta-fixes.md))


## Feature: FR.5 — Redesign certain images that I don't like [COMPLETED]
(See [tasks/completed/task-fr5-image-regeneration.md](tasks/completed/task-fr5-image-regeneration.md))

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
(See [tasks/completed/task-fr12-custom-context.md](tasks/completed/task-fr12-custom-context.md))

## Feature: FR.13 — System Prompt Preview Pane [COMPLETED]
(See [tasks/completed/task-fr13-system-prompt-preview.md](tasks/completed/task-fr13-system-prompt-preview.md))

## Task: FR.15 [COMPLETED]
(See [tasks/completed/task-fr15-context-templates.md](tasks/completed/task-fr15-context-templates.md))

## Feature: FR.18 — Persistence and Infrastructure [COMPLETED]
(See [tasks/completed/task-fr18-persistence-infra.md](tasks/completed/task-fr18-persistence-infra.md))

## Feature: FR.19 — Three-Pane Layout [COMPLETED]
(See [tasks/completed/task-fr19-three-pane-layout.md](tasks/completed/task-fr19-three-pane-layout.md))
### FR.19.5 — Expand Listing Preview width to the full right edge of the viewport [COMPLETED]

## Feature: FR.20 — Archive Listing Images [IN PROGRESS]
(See [tasks/completed/task-fr20-archive-images.md](tasks/completed/task-fr20-archive-images.md))
### FR.20.5 — Prevent duplicate archiving of listing images [NOT STARTED]
- [ ] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [ ] TDD track archived state in `useListingGeneration`
- [ ] Disable archive button in `ListingPreview` if image is archived

## Feature: FR.21 — Archive Uploaded Images [IN PROGRESS]
(See [tasks/completed/task-fr21-archive-uploads.md](tasks/completed/task-fr21-archive-uploads.md))
### FR.21.3 — Prevent duplicate archiving of uploaded images [NOT STARTED]
- [ ] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [ ] TDD track archived state in `useProductUpload`
- [ ] Disable archive button in `App.tsx` (UploadedImage) if image is archived

## Feature: FR.22 — Select Archived Uploads [COMPLETED]
Acceptance:
- [x] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [x] FR.22.1 — Collapsible section showing archived photos
- [x] FR.22.2 — Select up to 2 archived images
- [x] FR.22.3 — Preview selected archived images
- [x] FR.22.4 — TDD at hook layer
