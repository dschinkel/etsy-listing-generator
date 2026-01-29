## Feature: FR.15 [COMPLETED]
### Save Custom Context Templates
- [COMPLETED] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [COMPLETED] FR.15.1: Create `src/db/context-templates.json` and backend repository/data layer for templates.
- [COMPLETED] FR.15.2: Implement `GetContextTemplates` and `SaveContextTemplate` commands and controller endpoints.
- [COMPLETED] FR.15.3: Update `useProductUpload` hook to fetch and manage templates.
- [COMPLETED] FR.15.4: Update `ShotTypeItem` UI with template selection and save functionality.
- [COMPLETED] FR.15.5: Final verification and cleanup.
- [COMPLETED] FR.15.6: Ability to remove a saved custom context template.
    - Acceptance:
        - Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
    - RED: Test that DELETE /listings/templates/:name removes a template in ListingController.test.ts.
    - GREEN: Implement remove method in ContextTemplateRepository, RemoveContextTemplate command, and DELETE route in ListingController.
    - RED: Test removeTemplate in client ListingRepository.test.ts and useProductUpload.test.ts.
    - GREEN: Implement removeTemplate in client ListingRepository and useProductUpload hook.
    - UI: Update ShotTypeItem to use shadcn Select and add a remove button.
    - Verification and Cleanup.

## PR.15 Fix [COMPLETED]
### Resolve ReferenceError: templates is not defined in App.tsx
The Fix:
- [x] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [x] Create a reproduction test in `ListingGenerationUI.test.tsx`.
- [x] Fix the missing `templates` and `onSaveTemplate` in `ShotTypeItem` destructuring in `App.tsx`.
- [x] Verify the fix with tests.

## PR.15 Fix [COMPLETED]
### Ensure template selection populates custom context without duplication
The Fix:
- [x] Fixed backend duplication in `ListingRepository` by matching prompt instructions while ignoring count differences.
- [x] Updated `App.tsx` to append template text to custom context and avoid duplicate strings.
- [x] Verified fix with new test cases in `ListingGenerationUI.test.tsx` and manual verification.
- [x] All 70 tests passing.
