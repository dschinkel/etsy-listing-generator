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

**FR.2 — Specify number of type of images to generate**
    **FR.2.1 — Ability to specify how many images generated should be lifestyle shots**
    **FR.2.2 — Ability to specify how many images generated should be hero shots**
    **FR.2.3 — Ability to specify how many images generated should be close-ups**

**FR.3 — Specify which image will be used as the Primary Etsy image**

**FR.2 — Upload a background for product image**
    **FR.2.2 — Ability to upload a background image to be used for lifestyle shots**
    **FR.2.2 — Ability to upload a background image to be used for hero shots**
    **FR.2.2 — Ability to upload a background image to be used for close-ups**

**FR.1.6 — Show a final preview of the listing images**
**FR.1.7 — Redesign certain images that I don't like that**
    **FR.1.7.1 — Select an image to regen - create a new one**
    **FR.1.7.2 — Clicking the refresh button creates a new image**

**FR.1.8 — Reorder or arrange ordering of images**

**FR.1.9 — Remove images from the list**

**FR.1.11 — Fill out other listing fields**
    **FR.1.11.1 — About**
        **FR.1.11.1.1 — Title**
        **FR.1.11.1.2 — Images**
        **FR.1.11.1.3 — Description**
        **FR.1.11.1,4 — Personalization (optiona)**
    **FR.1.11.2 — Price & Inventory**
        **FR.1.11.2.1 — Price**
        **FR.1.11.2.2 — Quantity**
        **FR.1.11.2.3 — SKU**
    **FR.1.11.3 — Variations**
    **FR.1.11.4 — Details**
        **FR.1.11.4.1 — Category**
        **FR.1.11.4.2 — Tags**
    **FR.1.11.4 — Other fields**
        **FR.1.11.4.1 — Who Made**
        **FR.1.11.4.2 — When Made**
        **FR.1.11.4.3 — Is Supply**
        **FR.1.11.4.4 — Shipping Profile**
        **FR.1.11.4.5 — Product Type**
        **FR.1.11.4.6 — Readiness**
        **FR.1.11.4.7 — Taxonomy Id**

**FR.1.12 — Save Listing Draft**

**FR.1.13 — Publish Listing**

**FR.1.14 — Push the new listing to my etsy store**
    - **FR.1.14.1 Technical Notes**
        - use Etsy Open API v3 to fully automate the creation of listings, including uploading images, setting titles, and writing descriptions

---

## 4. Technical Requirements (TR.*)

### 4.1 Engineering Process
- Always follow the coding style and rules in `GUIDELINES.md`.
- Work in a TDD workflow when user opts in as specified by `GUIDELINES.md`.
- Before starting or resuming work after any prompt, re-read `GUIDELINES.md`.
- Before starting or resuming work after any prompt, provide the next behavior PLAN as specified by `GUIDELINES.md`.

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


---

## 9. Open Questions / Risk Areas


---
