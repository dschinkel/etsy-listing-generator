## Push repo [COMPLETED]
Acceptance:
- Re-read GUIDELINES.MD AND PROJECT_SPEC.MD

## Feature: Header, Title, Footer [COMPLETED]
### 0.1 Add a good looking modern header and footer to the app [COMPLETED]
### 0.2 Add a title to the app. Title should be in the header [COMPLETED]

## Feature: FR.1 — Upload a product image [COMPLETED]
### FR.1.2 — Ability to upload a PNG image as the product image to be used as context for generating listing images [COMPLETED]
### FR.1.2 — Ability to upload a jpg/jpeg image as the product image to be used as context for generating listing images [COMPLETED]

## Feature: FR.2 — Specify number of type of images to generate [COMPLETED]
### FR.2.1 — Ability to specify how many images generated should be lifestyle shots [COMPLETED]
### FR.2.2 — Ability to specify how many images generated should be hero shots [COMPLETED]
### FR.2.3 — Ability to specify how many images generated should be close-ups [COMPLETED]

## Feature: FR.3 — Specify which image will be used as the Primary Etsy image [COMPLETED]

## Feature: FR.3 — Upload a background for product image [COMPLETED]
### FR.2.2 — Ability to upload a background image to be used for lifestyle shots [COMPLETED]
### FR.2.2 — Ability to upload a background image to be used for hero shots [COMPLETED]
### FR.2.2 — Ability to upload a background image to be used for close-ups [COMPLETED]

## Feature: FR.4 — Show a final preview of the listing images [IN PROGRESS]
### FR.4.1 - Show thumbnail previews of images generated based on user input from FR.2.1 - lifestyle shots [COMPLETED]
### FR.4.1 - Show thumbnail previews of images generated based on user input from FR.2.2 - hero shots [NOT STARTED]
### FR.4.1 - Show thumbnail previews of images generated based on user input from FR.2.3 - close-ups [NOT STARTED]

Technical Requirements:
- [COMPLETED] Use product image as context for Gemini when generating lifestyle images
- Use nano banana as the model to generate the images
Add an .env that allows me to specify my Gemini API key as 
GEMINI_API_KEY= that you'll use to hit Gemini for generation of my listing images


## Feature: FR.5 — Redesign certain images that I don't like [NOT STARTED]
### FR.5.1 — Select an image to regen - create a new one [NOT STARTED]
### FR.5.2 — Clicking the refresh button creates a new image [NOT STARTED]

## Feature: FR.6 — Reorder or arrange ordering of images [NOT STARTED]

## Feature: FR.7 — Remove images [IN PROGRESS]
### FR.7.1 — Ability to Remove uploaded image [COMPLETED]
### FR.7.2 — Ability to remove a listing image from the list of images [NOT STARTED]

## Feature: FR.8 — Fill out other listing fields [NOT STARTED]
### FR.1.8.1 — About [NOT STARTED]
#### FR.1.8.1.1 — Title [NOT STARTED]
#### FR.1.8.1.2 — Images [NOT STARTED]
#### FR.1.8.1.3 — Description [NOT STARTED]
#### FR.1.8.1.4 — Personalization (optiona) [NOT STARTED]
### FR.1.8.2 — Price & Inventory [NOT STARTED]
#### FR.1.8.2.1 — Price [NOT STARTED]
#### FR.1.8.2.2 — Quantity [NOT STARTED]
#### FR.1.8.2.3 — SKU [NOT STARTED]
### FR.1.8.3 — Variations [NOT STARTED]
### FR.1.8.4 — Details [NOT STARTED]
#### FR.1.8.4.1 — Category [NOT STARTED]
#### FR.1.8.4.2 — Tags [NOT STARTED]
### FR.1.8.4 — Other fields [NOT STARTED]
#### FR.1.8.4.1 — Who Made [NOT STARTED]
#### FR.1.8.4.2 — When Made [NOT STARTED]
#### FR.1.8.4.3 — Is Supply [NOT STARTED]
#### FR.1.8.4.4 — Shipping Profile [NOT STARTED]
#### FR.1.8.4.5 — Product Type [NOT STARTED]
#### FR.1.8.4.6 — Readiness [NOT STARTED]
#### FR.1.8.4.7 — Taxonomy Id [NOT STARTED]

## Feature: FR.9 — Save Listing Draft [NOT STARTED]

## Feature: FR.10 — Publish Listing [NOT STARTED]

## Feature: FR.11 — Push the new listing to my etsy store [NOT STARTED]

### FR.11.1 — Technical Notes [NOT STARTED]

## Task: Fix [COMPLETED]
### Resolve 404 error when clicking generate listing images button
The Fix:
- [COMPLETED] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [COMPLETED] Created `src/service/index.ts` to start the backend Koa server.
- [COMPLETED] Configured Vite proxy in `vite.config.ts` to forward `/listings` requests to the backend.
- [COMPLETED] Updated `package.json` to run both frontend and backend concurrently in `dev` mode.

## Task: Fix [COMPLETED]
### Reduce the time it takes to see the variation selected by avoiding redundant Adobe Typekit API calls.
The Fix:
- [COMPLETED] Re-read GUIDELINES.MD AND PROJECT_SPEC.MD
- [COMPLETED] `AddFont` use case checks the local repository before calling Adobe's `fetch`.
- [COMPLETED] `AddFont` checks the current kit families and avoids `publishKit` if the family is already present.
- [COMPLETED] `SyncFontKit` avoids redundant `publishKit` calls on startup.
- [COMPLETED] All tests pass.
