## Feature: UI Refinement - Shots Selection Gap [COMPLETED]
The Fix (TDD):
- [x] RED: Added failing test `ShotTypeGap.test.tsx` to verify vertical alignment and gap constraint.
- [x] GREEN: Updated `ShotTypeItem` in `App.tsx` to use `justify-between` for vertical alignment and `max-w-3xl` to reduce the horizontal gap.
- [x] RED: Added failing test `Whitespace.test.tsx` to verify further width reduction to `max-w-xl`.
- [x] GREEN: Reduced `max-w-3xl` to `max-w-md` in `ShotTypeItem` and set `w-fit` on `ShotsSelection` card to eliminate trailing horizontal whitespace.
- [x] Verified all tests passing.
- [x] Removed temporary test files as requested (cosmetic fix).
