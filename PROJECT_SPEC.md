# PROJECT SPEC

Project: `etsy-listing-generator`

Purpose: Build a small web app that as an Etsy Seller, 
allows me to provide a product image and the app generates a 
complete set of listing images and listing for a new Etsy product I will be selling

This document is the **source of truth** for product behavior, architecture decisions, and key technical choices.  
All implementation work must follow `GUIDELINES.md` which is located at the root of the project.
At the start of every task and before proceeding to the next step in the PLAN, Junie must re-load PROJECT_SPEC.md and GUIDELINES.md from disk, state what the next step is, and ask the User for permission to proceed.
All behavior mentioned below are to be incrementally implemented will be broken down into smaller tasks defined in `tasks.md` and worked on one at a time.

---

## 0. Header, Title, Footer
0.2 Add a title to the app. Title should be in the header
0.1 Add a good looking modern header and footer to the app.

## 1. Scope and Outcomes
1.1  Primary User Outcome
A user can:
    - upload a product image that will be used as context to create listing images
    - Ability to take the image as context and generate a main project image for the listing
    - Shows me the Edit View of the Listing with the new image
    - Shows me a preview of the listing with the new image
    - Push the new listing to my etsy store
---

---

## 2. Repo Layout and Boundaries

### 2.1 Code Roots
- Client (frontend) root: `src/client/`
- Service (backend) root: `src/service/`

### 2.2 Data Storage
- All persisted data must be stored in local JSON files under `src/db/`.
- Generated PNG artifacts may be stored on disk; any file paths or metadata are recorded in JSON under `src/db/`.

---

## 3. Product Requirements

### 3.1 Feature Requirements (FR.*)

**FR.1 — Upload a product image**
    **FR.1.2 - Ability to upload a PNG image as the product image to be used as context for generating listing images**
    **FR.1.2 - Ability to upload a jpg/jpeg image as the product image to be used as context for generating listing images**

**FR.1.3 - Ensure that generation is disabled if no product image is loaded.**

**FR.1.4 — Multiple Reference Images**
    - **FR.1.4.1 — Ability to upload up to 2 reference context images (product images).**
    - **FR.1.4.2 — Both reference images are sent to the AI model as context for generating listing images.**
    - **FR.1.4.3 — UI allows individual removal and primary selection (if applicable, though primary is usually one).**

**FR.2 — Specify number of type of images to generate**
    **FR.2.1 — Ability to specify how many images generated should be lifestyle shots**
    **FR.2.2 — Ability to specify how many images generated should be hero shots**
    **FR.2.3 — Ability to specify how many images generated should be close-ups**
    **FR.2.4 — Ability to specify how many images generated should be flat lay shots**
    **FR.2.5 — Ability to specify how many images generated should be macro/detail shots**
    **FR.2.6 — Ability to specify how many images generated should be contextual shots**
    **FR.2.7 — Ability to specify how many images generated should be themed environment shots (The product is placed in a realistic, thematic setting)**
    **FR.2.8 — Clear all shot counts automatically once the generation request has been made.**

**FR.3 — Specify which image will be used as the Primary Etsy image**
    - **FR.3.1 — Ability to mark an uploaded product image as primary**
    - **FR.3.2 — Ability to mark a single generated image as the Primary Etsy Image**

**FR.17 — Background Upload for Shot Types**
    - **FR.17.1 — Ability to upload a background image for each specific shot type**
    - **FR.17.2 — Upload buttons are located in the "Shots Selection" list, to the right of the "+" (custom context) button with 10px padding**

**FR.18 — Persistence and Infrastructure**
    - **FR.18.1 — Persist generated images in `src/assets/generated-images`**
    - **FR.18.2 — Automated model retry and fallback logic**
    - **FR.18.3 — Enforce 15-second timeout for individual production API calls**
    - **FR.18.4 — Ensure images are deleted from disk when the corresponding record is removed (Uploaded product image, Listing preview image, or "Clear All").**

**FR.4 — Show a final preview of the listing images**
    **FR.4.4 — Ability to click a Listing Preview Thumb and see the full res image in a modal**
    **FR.4.5 — Ability to see which shot type generated each image (displayed below thumbnails)**
    **FR.4.6 — Ability to see which AI model was used for the current generation**
    **FR.4.7 — AI model status message is displayed at the top left of the Listing Preview section during generation.**
**FR.5 — Redesign certain images that I don't like**
    - **FR.5.1 — Ability to add specific custom context to an existing generated image via a "+" button.**
    - **FR.5.2 — Ability to regenerate a single image using its specific custom context via a "Regenerate" button.**
    - **FR.5.3 — The regenerated image replaces the original image in the Listing Preview.**
    - **FR.5.4 — Regeneration uses the same model and logic as the main generation process.**

**FR.6— Reorder or arrange ordering of images**

**FR.7 — Remove images from the list**

**FR.8 — Fill out other listing fields**
    **FR.1.8.1 — About**
        **FR.1.8.1.1 — Title**
        **FR.1.8.1.2 — Images**
        **FR.1.8.1.3 — Description**
        **FR.1.8.1,4 — Personalization (optiona)**
    **FR.1.8.2 — Price & Inventory**
        **FR.1.8.2.1 — Price**
        **FR.1.8.2.2 — Quantity**
        **FR.1.8.2.3 — SKU**
    **FR.1.8.3 — Variations**
    **FR.1.8.4 — Details**
        **FR.1.8.4.1 — Category**
        **FR.1.8.4.2 — Tags**
    **FR.1.8.4 — Other fields**
        **FR.1.8.4.1 — Who Made**
        **FR.1.8.4.2 — When Made**
        **FR.1.8.4.3 — Is Supply**
        **FR.1.8.4.4 — Shipping Profile**
        **FR.1.8.4.5 — Product Type**
        **FR.1.8.4.6 — Readiness**
        **FR.1.8.4.7 — Taxonomy Id**

**FR.9 — Save Listing Draft**

**FR.10 — Publish Listing**

**FR.11 — Push the new listing to my etsy store**
    - **FR.11.1 Technical Notes**
        - use Etsy Open API v3 to fully automate the creation of listings, including uploading images, setting titles, and writing descriptions

**FR.12 — Custom Context for Shot Types**
    - Ability to add specific instructions for each shot type via a "+" icon (e.g., "In a high-end kitchen").
    - Custom context textbox should be multiline, be longer horizontally by default and draggable in terms of making it horizontally longer.
    - FR.12.3 Ensure that when Custom Context is added or selected from the template dropdown, the corresponding shot type count is set to at least 1 if it is currently 0. Likewise, if the custom context is cleared, the count should be reset to 0.
    - FR.12.4 Add a feature that allows me to clear Custom Context. Add that button next to the save button. Add it before the save button.
    - FR.12.5 Clearing the custom context should also reset the custom context dropdown to its default value.

**FR.13 — System Prompt Preview Pane**
    - Ability to see the final system prompt sent to the AI model in a resizable side pane.

**FR.14 — Download Generated Images**
    - Ability to download individual images directly to the hard drive.
    - Ability to download all generated images as a single ZIP file.

**FR.15 — Save Custom Context Templates**
    - Ability to save the current custom context text as a named template.
    - Templates are stored in a local JSON database (`src/db/context-templates.json`).
    - Ability to select a saved template from a dropdown in the Custom Context section.
    - Selecting a template populates the custom context text area.
    - Ability to manually edit the custom context even after selecting a template.
    - Prompt for a name when saving a new template.
    - Ability to remove a saved custom context template.

**FR.16 — UI Refinement and Auto-scroll**
    - **FR.16.1 — Auto-scroll to Listing Preview after generation**
    - **FR.16.2 — Reduce gaps and whitespace in Shots Selection and Listing Preview**
    - **FR.16.3 — Center-align generation controls with Shots Selection**
    - **FR.16.4 — Scroll to the top of the page immediately when "Generate Listing Images" is clicked.**

**FR.19 — Three-Pane Layout**
    - **FR.19.1 — Move Listing Preview to a third pane on the right of the Shots Selection section.**
    - **FR.19.2 — Ensure the Listing Preview section fills the page vertically.**
    - **FR.19.3 — Implement internal scrolling for the Listing Preview pane so the main page remains fixed.**
    - **FR.19.4 — Adjust layout to bring the Listing Preview closer to the Shots Selection and increase its width.**
    - **FR.19.5 — Expand Listing Preview width to the full right edge of the viewport.**

**FR.20 — Archive Listing Images**
    - **FR.20.1 — Ability to archive (save) the current list of listing images to `./src/assets/archived-images`.**
    - **FR.20.2 — Add an "Archive All" button next to "Clear All" in the Listing Preview section.**
    - **FR.20.3 — Archived images should be copies of the generated images, preserved even if the originals are deleted.**

---

## 4. Technical Requirements (TR.*)

### 4.1 Engineering Process
- Always follow the coding style and rules in `GUIDELINES.md`.
- Work in a TDD workflow when user opts in as specified by `GUIDELINES.md`.
- Before starting or resuming work after any prompt, re-read `GUIDELINES.md`.
- Before starting or resuming work after any prompt, provide the next behavior PLAN as specified by `GUIDELINES.md`.
- Every task created in `tasks.md` MUST have as its first acceptance criterion: `- Re-read GUIDELINES.MD AND PROJECT_SPEC.MD`.

### 4.2 Project Bootstrap
- Initial project boilerplate must be copied from: `~/zevia/code/ai/react-app-boilerplate`
- The new folder name must be: 

### 4.3 UI Components / Styling
- Always use shadcn/ui components when third-party UI components are needed.

### 4.4 React Architecture
- Separate application logic from React views.
- Views must be humble and ignorant of implementation details:
    - Handler, fetch, and other logic must live in hooks.
    - Hooks call repositories/services via injected dependencies. Therefore there will be two layers below hooks:
      - Repositories which make API calls and return data.
      - Business which is any app agnostic business logic that hooks need in order to orchestrate the model's use cases.

### 4.5 Testing
- Use Jest, React Testing Library, and React Hook Testing Library as appropriate.
- Backend / Server code will use Jest as its testing framework
- Tests are written first (TDD), one at a time, per `GUIDELINES.md`.
- Test naming and variables must use domain language. Do not use technical terms like "mock". Use domain terms for test data and "fake" for stubs (e.g., `fakeRepository` instead of `mockRepository`). Do not use `jest.fn()` for stubs; use simple functions.
- Do not test for loading state in hook tests.
- Treat the System Under Test (SUT) as a black box. Avoid using spies or asserting that internal dependencies were called when the output itself can be asserted.
- UI tests must use `data-testid` instead of finding elements by text (e.g., `getByText`, `findByText`). Data test IDs must represent domain concepts (e.g., `data-testid="font-selection"`).
- Commit messages for TDD steps must follow the format: `feat: <feature-id>: Step <number>: <step-name>`.
- Function placement: Always put functions being called from the parent, below the parent.

### 4.6 Data / JSON DB
Store all data in local JSON files under `src/db/`.

Minimum required:
- `src/db/<something>.json` stores font metadata used by the app (name, IDs, metadata needed by the system).

### 4.7 LLM Requests (TOON)
Whenever sending API calls to LLM Models, ensure that any request this app sends is converted first using TOON format notation:
- https://github.com/toon-format/toon

---

## 5. UI Specification

### 5.1 Primary Screen

---

## 6. Backend / Service Architecture

### 6.1 Onion Architecture Layers (required)
The service code must follow this strict layering:

**Controller → Command → Business Logic -> Repository → Data Layer**

Rules:
- Controllers are pass-through adapters only (delivery mechanism boundary).
- Commands represent user commands/use-cases and orchestrate the use-case.
- Business logic is pure and domain agnostic.
- Repositories orchestrate access to data sources and provide stable domain-oriented interfaces.
- Data layer performs IO (HTTP, filesystem, DB drivers, SDK wrappers) and is injected into repositories.

### 6.2 Controller Layer (Pass-through)
Controllers must:
- Accept delivery mechanism input (HTTP request, queue message, etc.)
- Translate it into a pure request Data JS Object (no framework types)
- Call the command with the request Data JS Object
- Translate the response Data JS Object back into a delivery mechanism response

Controllers must not:
- Contain business decisions
- Perform domain orchestration
- Touch persistence directly

### 6.3 Command Layer (Use-cases)
Commands must:
- Represent a single user use-case
- Accept request DTOs that have been stripped of delivery concerns
- Use injected pure business logic and injected repositories/services to execute the use-case
- Produce a response Data JS Object

Commands must not:
- Depend on HTTP/framework types (Express/Fastify req/res, headers, etc.)
- Construct their dependencies internally

### 6.4 Request/Response DTOs
- Request and response objects passed between layers must be plain data (serializable, delivery-agnostic).
- No framework objects, no HTTP types, no SDK types inside DTOs.

---

## 7. Data Model (Initial)

---

## 8. Technology Plan (Bird’s-eye)

### 8.1 Client (src/client)
- React + TypeScript
- shadcn/ui components:
    - Combobox/dropdown for fonts
    - Inputs for text
    - Cards/tiles
 
### 8.2 Service (src/service)
- Koa.js + TypeScript


---

## 9. Open Questions / Risk Areas


---
