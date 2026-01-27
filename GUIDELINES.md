# GUIDELINES (v1.4)

Scope: Applies to all coding tasks executed by Junie or any AI agent in this repo.

Precedence (highest wins):
1) The user’s instructions in the current chat
2) This document (GUIDELINES.md)
3) Existing codebase conventions
4) General best practices

Agent acknowledgement:
At the start of any task workflow (the message where you present the PLAN), AND at the start of every response to a user prompt during a task, output exactly:
ACK:GUIDELINES_READ

Do NOT output ACK when answering questions or doing non-task discussion (i.e., when you are not starting a PLAN / task workflow or actively working through an ongoing task).

---

## P0. Agent Protocol (non-negotiable)

P0.0 When the user says `work on task <number>`, ask this question BEFORE producing any PLAN:
"Do you want the PLAN to include a full TDD workflow (RED → GREEN → REFACTOR + commit prompts), or a non-TDD execution plan?"

P0.0.1 Do not present a PLAN until the user answers the question in P0.0.

P0.1 Before writing or changing any code, produce a PLAN when the user says: `work on task <number>` and after resolving P0.0.
Always present the PLAN again before proceeding to the next step in the PLAN.
P0.1.1 Before proceeding to the next step in the PLAN, re-load PROJECT_SPEC.md and GUIDELINES.md from disk, state what the next step is, and ask for explicit permission to proceed.
P0.1.2 Every PLAN must include a visually appealing, styled Mermaid diagram rendered as a PNG image in the `flows/` directory only if the task requirements specifically ask for a flow. Otherwise, skip the flow. If a flow is required, the image must be named according to the feature (e.g., `flows/FR.3.1_Generate_Base_SVG.png`). You MUST use the `open` tool to display this image in the IDE's right-hand pane when presenting the PLAN.
P0.2 The PLAN must include, in the first line, the task number and the feature name.
P0.3 The PLAN must list each planned increment and explicitly name the test(s) that will be written for each increment if (and only if) the user chose a TDD workflow in P0.0. Each TDD increment in the PLAN must strictly follow the RED → GREEN → REFACTOR cycle, including the REFACTOR step even if no immediate refactoring is anticipated, to ensure the opportunity for improvement is never overlooked.
P0.4 After presenting the PLAN, ask whether to proceed. Do not proceed without an explicit “continue/proceed” from the user.
P0.5 If the user tells you to proceed, copy the approved PLAN into `tdd.log` before starting implementation (only applies when the user chose a TDD workflow in P0.0).
P0.5.1 When copying the PLAN into `tdd.log`, include the full PLAN text verbatim under a `PLAN:` heading.
P0.6 After completing each step in the PLAN, summarize the step you just completed and ask to proceed to the next step. Tell me what the next step is.
P0.7 If the user stops you midstream with a question or change request, log the interruption and the resolution in `tdd.log` (only applies when the user chose a TDD workflow in P0.0).
P0.8 If the user reverts an implemented plan, remove the corresponding plan and its workflow entries from `tdd.log` (only applies when the user chose a TDD workflow in P0.0).
P0.9 For React work, when presenting a PLAN, explicitly ask whether Step 1 (Component layer) should be a non-TDD scaffold or if it should be TDD'd (which would require explicit instruction to write UI tests).
P0.10 At the very end of a task (after all steps and cleanup), you MUST mark the task as [COMPLETED] in `tasks.md`, run all tests one last time, run the linter and fix any errors, start the app and verify no runtime errors, and then perform a final cleanup commit and push before calling `submit`.

G1.11 At the end of every task, you MUST run the linter (e.g., `npx tsc --noEmit` or `npm run lint`) and fix any reported errors. You MUST also run the application (e.g., `yarn dev` or `npm run dev`) and verify that there are no runtime errors in the logs or in the browser. This is mandatory for every task.
G1.12 At the end of every task, you MUST run all tests (e.g., `npm run test`) and fix any reported errors. This is mandatory for every task.
P0.11 When iterating on a feature, do not mark it as [FAILED] or create new "fix" tasks if it doesn't meet acceptance criteria immediately. Instead, keep the current task [IN PROGRESS] and iterate until it is [COMPLETED].
P0.11.1 When starting a task, you MUST move the task from [NOT STARTED] to [IN PROGRESS] in `tasks.md`.
P0.12 NEVER call `submit` if there are uncommitted or unpushed changes related to the task. Every task completion must end with a push to the remote repository.
P0.13 When asked to add a new feature, you must always add it at the higher level in `PROJECT_SPEC.md` first, then break that out into smaller tasks second in `tasks.md` using the `PROJECT_SPEC` feature number.
P0.14 If asked for an out of bounds fix, relate it to the current task and append the information to `tasks.md` using the following format:
```markdown
## Task: Fix [COMPLETED]
### <Description of the fix>
The Fix:
- [COMPLETED] <Subtask 1>
- [COMPLETED] <Subtask 2>
...
```

---

## T1. TDD Workflow (non-negotiable, only when user opts-in per P0.0)

T1.1 Work in RED → GREEN → REFACTOR cycles.
T1.2 In RED, write exactly one failing test that defines a single small behavior increment. Do not write multiple tests in a single RED step.
T1.3 Default test level rules:
T1.3.1 For React work, start by creating the component layer code (the "View") without tests. This is usually Step 1 of the PLAN, but it is NOT part of the TDD workflow (no RED phase). TDD (RED → GREEN → REFACTOR) MUST start at the hook layer (Step 2) once the component code is present. You MUST NEVER write UI component tests or integration tests (e.g., tests that use `fireEvent`, `render` of components to verify behavior) unless explicitly instructed by the user. When creating component layer code, provide props as placeholders for where we will inject hook logic later. Component code must not contain logic; logic belongs in hooks and lower layers.
T1.3.2 For non-React work, write tests at the behavioral/business layer level (headless/functional) and avoid end-to-end/system tests unless explicitly instructed.
T1.3.3 You MUST NEVER write tests at the Controller layer. Controllers are delivery-mechanism adapters and must remain pass-through only. Business behavior must be defined and tested at the Command (Use Case) or Domain layer.
T1.3.4 Disallowed by default (unless explicitly instructed or for service data layer): browser/UI integration tests, real network calls, end-to-end tests, full-stack HTTP tests.
T1.3.5 Allowed by default: in-process “integration” tests that do not require a browser and do not make real network calls (for example, repository tests using in-memory or file-backed fakes).
T1.3.6 Service Data Layer Integration: Tests located in `src/service/test/integration/` MUST be integration tests that hit real external services, databases, or file systems. They must not use fakes or mocks for the primary IO target of that module. Integration test files must not use the word "integration" in their name; instead, they should be named after the behavior or component they test (e.g., `GeminiImageGenerator.test.ts`).
T1.4 In GREEN, write only the minimum production code required to pass the single failing test; no extra functionality.
T1.5 After GREEN, you MUST explicitly ask for permission to commit using: `feat: <task-id>: <behavior>`. After the commit, ask whether to push or continue.
T1.5.1 After tests run GREEN, you MUST restart the website and services using `yarn dev` in the background and verify no errors are outputted. Fix any errors that occur during startup or runtime.
T1.6 In REFACTOR, refactor only while tests are green. Make one refactoring change at a time and run tests after each small refactor (TCR).
T1.7 If refactoring occurred, you MUST explicitly ask for permission to commit using: `feat: <task-id>: refactor: <behavior>`. After the commit, ask whether to push or continue.
T1.8 Cleanup & Verification must include running tests and fixing lint warnings/errors. Then prompt the user to commit using: `feat: <task-id>: cleanup: <behavior>`.
T1.9 `tdd.log` must relate every RED | GREEN | REFACTOR entry to its corresponding PLAN step number.
T1.10 When fixing a defect or implementing a feature with a clear external contract, first write an “API-level” failing test. In this repo, “API-level” means the public boundary for the behavior (typically the hook public API or the domain service function), not an HTTP endpoint or end-to-end test unless explicitly requested.
T1.11 When tests fail, fix implementation first, not the test, unless the test clearly contradicts the spec.
T1.12 Always follow an outside-in TDD approach. Start implementation at the highest permitted layer (e.g., UI components or Hooks for frontend, Controllers or API routes for backend) and work your way down to the lower-level collaborators (repositories, commands, domain logic). When a dependency is needed but has not been implemented yet, provide a simple custom stub (a "fake") for that dependency to satisfy the current test and allow the current step to go GREEN.
T1.13 The backend / service code should also be implemented outside-in. This means starting from the entry point (Controller/App route) and working down through the use cases to the data layer, ensuring each layer is defined by a test before its implementation and dependencies are built.
T1.14 Strict Outside-In Ordering: When presenting a PLAN or executing tasks, you MUST always start from the highest level of the delivery mechanism (UI for frontend, Controller for backend) and work your way down. You must never start from the domain or data layer and work up. The PLAN must explicitly list steps in this top-down order.
T1.15 You MUST NOT use `@jest-environment` comments to set the test environment in individual test files. Instead, ensure the global `jest.config.js` is configured with `projects` to automatically apply the correct environment (e.g., `jsdom` for `src/client` and `node` for `src/service`) based on the file path.
T1.16 Repeated code in tests, such as `render(<App />);`, MUST be DRY'd up by moving it to a `beforeEach` block at the appropriate scope.

---

## N1. Test Naming (non-negotiable; applies when tests are being written)

N1.1 Tests and test suites (describes) must describe business behavior in clear prose.
N1.2 Do not include function names, endpoints, browser/view terms, or technical sources in test or describe names. This keeps them decoupled from the actual implementation. Test names do not need to specify their parent names or unnecessary technical words (e.g., use "removes a font" instead of "removes a font use case" or "RemoveFontCommand removes a font").
N1.3 Avoid “should” and avoid overly-specific phrasing. Prefer short domain behavior labels. 
N1.3.1 Test names (`it`, `test`) must be written in all lowercase.
N1.3.2 Describe names (`describe`) should be written in normal case (sentence case or title case) with spaces.
N1.4 Canonical examples live in Appendix D.
N1.5 Test data and stubs must not use the word "mock". Use domain terms for data and "fake" if it's a JS object and you're stubbing something inside it, OR call it a stub if it's JUST a function not wrapped in anything else (e.g., `fakeRepository`, `fakeFonts`, `fakeReader`).
N1.6 Do not test for loading state in hook tests.
N1.7 Treat the System Under Test (SUT) as a black box. Avoid using spies or asserting that internal dependencies were called when the output itself can be asserted.
N1.7.1 Do not use `jest.fn()` or any testing library "magic" for creating stubs or fakes. Use simple JavaScript functions instead.
Good: `const fakeRepository = { getFonts: () => fonts };`
Bad: `const fakeRepository = { getFonts: jest.fn().mockResolvedValue(fonts) };`
N1.8 Use JSX syntax in React tests. Do not use `React.createElement` in tests.
Bad: `render(React.createElement(FontSelector, { fonts: fonts, onSelect: () => {} }));`
Good: `render(<FontSelector fonts={fonts} onSelect={() => {}} />);`

N1.9 UI tests must use `data-testid` instead of finding elements by text (e.g., `getByText`, `findByText`). 
Data test IDs must represent domain concepts.
Example: For a font selector, use `data-testid="font-selection"`.

N1.10 Test names must be delivery mechanism and framework agnostic.
Good: `adds a font`
Bad: `posts a new font`, `adds a font by fetching from adobe`, `calls the api to add a font`.

N1.11 Do not test for specific CSS classes or styles (e.g., `toHaveClass('opacity-0')`). Tests must be decoupled from visual implementation details, as styling is verified through visual inspection.

---

## A1. Architecture & DDD

A1.1 Use domain language for files, functions, variables, tests, and modules.
A1.2 Organize by business domain rather than technical layer names (for example billing/, registration/).
A1.3 Domain naming rule: domain files must not contain the word “domain” (Prompt.ts not PromptDomain.ts).
A1.4 Avoid generic buckets like util, utils, helper, helpers. Use domain terms instead.

A1.5 Repository abstractions:
A1.5.1 Repository modules represent domain objects (PromptRepository, UserRepository).
A1.5.2 Repositories depend on injected lower-level data sources for IO.
A1.5.3 Inject mechanisms that perform IO (HTTP clients, SDKs, DB drivers, file system adapters) into a data layer, then inject that data layer into repositories, then inject repositories into hooks/components.
A1.5.4 Persistence and API details must not leak into UI components or domain logic.

A1.6 Backend Onion Architecture (Command + Controller + Request/Response DTOs):
A1.6.1 Commands represent user commands/use-cases. Each command is responsible for executing exactly one use-case.
A1.6.2 Controllers are delivery-mechanism adapters and must be pass-through only:
- Accept delivery-specific input (HTTP, queue, RPC, etc.)
- Translate it into a pure request data object with delivery concerns stripped
- Call the command to carry out the use case
- Translate the command response DTO into the delivery mechanism response
  A1.6.3 Data passed between layers uses explicit Request and Response data objects. Data Objects must be plain data (plan js objects) with no delivery or framework types.
  A1.6.4 Commands must not depend on delivery/framework concerns (Express/Fastify request, headers, auth middleware, etc.). They accept only the request DTO.
  A1.6.5 Commands must use injected pure business logic to fulfill the use-case:
- Domain objects and any necessary pure business objects are are injected into the command in order for the command to carry out its use-case
- Data layer and persistence access is injected indirectly (via repositories/data services), not constructed inside the command
  A1.6.6 The command owns orchestration of the use-case:
- Validate/interpret the request Data Object in domain terms
- Invoke domain logic and required injected business objects
- Produce a response Data Object for the controller to return to the service caller
  A1.6.7 Controllers must not contain business decisions. Commands must not contain delivery decisions.
  A1.6.8 Frontend (src/client) architecture: Frontend does not use controllers or commands. Application logic is handled by hooks which call repositories.

---

## R1. React Rules

R1.1 Humble views: UI components are thin; logic belongs in hooks below. This includes keeping loading and error logic (e.g., conditional rendering or early returns based on loading/error states) out of the component and moving it into hooks.
R1.2 No fetch/service/tool-call logic inside React components.
R1.3 Hooks may orchestrate IO by calling injected repositories, but must not embed HTTP/SDK/file logic directly. Repositories encapsulate use-case intent and call injected data-layer dependencies for IO.
R1.4 No useEffect inside React components. useEffect may exist only inside hooks.
R1.5 Avoid spaghetti JSX. Extract mapping/conditions into small, well-named domain components.
R1.6 Component naming must be domain-oriented and must not include unnecessary technical suffixes (Component, View, Module, Modal, Input). Use domain ideas instead.
R1.7 Use guard clauses by extracting conditional rendering into a domain component that returns null when not applicable.
R1.8 Tests: default to hook-layer tests (React Hook Testing Library) and then unit tests for lower-level pure functions.

---

## Q1. Code Quality

Q1.1 NO COMMENTS in production or test code under ANY circumstances (unless it is a mandatory linter suppression). If you want to comment, extract a named function/component instead. You MUST NOT add explanatory comments, TODOs, or any other form of documentation inside code files.
Q1.2 File size limits:
Q1.2.1 Non-React files must not exceed 150 lines.
Q1.2.2 React component files must not exceed 200 lines.
Q1.3 Do not keep appending new behavior into one file. Refactor by extracting well-named domain functions/components during REFACTOR. If you are ever not sure what to name it, ask the user.
Q1.4 Functions should read like well-written prose and communicate domain intent. Prefer guard clauses and small composed functions over nested conditionals. Deeply nested conditionals or loops (more than 2 levels) are strictly forbidden. Conditionals or Loops must be extracted to small, well-named composed functions whose name explains what it does in well-written prose (no technical terms). Use functional patterns (like `find`, `map`, `filter`) to keep logic flat and readable.

Example (Bad):
```typescript
const lifestyleCount = params.lifestyleCount || 0;
for (let i = 0; i < lifestyleCount; i++) {
  const imageUrl = await this.dataLayer.generateImage({ 
    type: 'lifestyle',
    prompt: 'a lifestyle shot of a product',
    productImage: params.productImage
  });
  images.push(imageUrl);
}
```

Example (Good):
```typescript
await lifestyleImages(params.lifestyleCount, params.productImage, images);

// extracted function below parent
async function lifestyleImages(count: number = 0, productImage: string, images: string[]) {
  for (let i = 0; i < count; i++) {
    images.push(await dataLayer.generateImage({ 
      type: 'lifestyle',
      prompt: 'a lifestyle shot of a product',
      productImage
    }));
  }
}
```
Q1.5 Minimize state and side effects; keep pure logic in `domain/` for backend and for client under `src\client\domain.
Q1.6 Function placement: Always put functions being called from the parent, below the parent. The primary/parent component or function in a file must be at the top.
Q1.8 Strictly FORBID the use of JavaScript/TypeScript classes. All code must follow the functional module pattern. Use plain functions and objects. Data should be passed as arguments, and dependencies should be handled through function parameters or factory functions. This ensures better testability, simpler composition, and adheres to Clean Code principles in a functional style.
Q1.9 Duplicated code (more than 1 occurrence of similar logic) MUST be DRY'd up by extracting to a reusable function or component. This applies to both production and test code.

---

## TS1. Types & TypeScript

TS1.1 Do not prefix interfaces/types with “I” (PromptRepository, not IPromptRepository).
TS1.2 Prefer explicit domain types over ad-hoc inline shapes.

---

## G1. Git Discipline

G1.1 Only commit when tests are green and lint/compile warnings are resolved.
G1.2 Keep commits small and frequent.
G1.3 Separate structural changes from behavioral changes (Tidy First).
G1.4 Commit messages must be domain/behavior oriented:
G1.4.1 Behavioral: `feat: <feature-id>: Step <number>: <layer>: <step-title-prose>`. For hook-related logic, the layer should be `Frontend: Hook`. (Example: `feat: FR.1.2: Step 2: Frontend: Hook: Adds a new font`). For infra or setup tasks, use the task name. (Example: `feat: Task 0: Push repo`)
G1.4.2 Refactor: `feat: <feature-id>: refactor: <behavior>`
G1.4.3 Cleanup: `feat: <feature-id>: cleanup: <behavior>`
G1.5 When adding a new feature from `PROJECT_SPEC.md`, you must break it down into the smallest possible actionable tasks in `tasks.md` using the exact sub-item numbering from the spec (e.g., `FR.1.1`, `FR.1.2`, `FR.1.2.1`). Each sub-item from the spec must have its own task in `tasks.md`.
G1.6 You must only work on one sub-task at a time. You should never work on a top-level feature (e.g., `FR.1`) directly if it can be broken down into sub-tasks (e.g., `FR.1.1`). After completing a sub-task, you must stop and ask for permission to proceed to the next one, even if you are in "Brave" mode or any autonomous mode. This is a hard constraint to ensure incremental feedback and prevent scope creep.
G1.6.1 Even if multiple sub-tasks seem trivial or related (e.g., adding three different shot counts), you MUST implement only one, verify it, and wait for explicit permission before starting the next.
G1.7 If no task exists in tasks.md, still commit with a meaningful message.
G1.8 When the user approves a commit prompt, you MUST immediately execute the corresponding git commit command via bash. Do not wait for the next turn.
G1.9 Test descriptions (e.g., in `describe` or `it` blocks) must not contain feature numbers or task IDs. Use domain language only.
G1.10 When all sub-tasks for a parent feature are marked as `[COMPLETED]`, you must also mark the top-level parent feature as `[COMPLETED]` in `tasks.md`.
G1.11 You MUST top and re-run the site using `yarn dev` after completing every task (after tests pass GREEN) and fix any issues that occur during startup or runtime. This is mandatory verification before proceeding to the next task.

---

## R1. React & UI (non-negotiable)

R1.1 React components must be written to read like a "newspaper" (Clean Code). Avoid "spaghetti JSX" or large blocks of raw HTML/DOM tags.
R1.1.1 Small chunks of JSX that represent a specific behavior or domain concept must be extracted into small components (can be in the same file if appropriate).
R1.1.2 Use domain-oriented component names (e.g., `<UploadImage />`, `<UploadedImage />`) to ensure the parent JSX speaks in domain prose.
R1.1.3 Avoid inline conditional rendering logic (e.g., `{condition && <JSX />}`) in the parent. Move the logic into the child component as a guard clause (returning `null` if the condition is not met).
R1.1.4 The main/parent component must be at the top of the file. Child components must be ordered below the parent, in the order in which they are called (top-to-bottom).

R1.2 You must strictly separate application logic from React views. Views must be humble and ignorant of implementation details.
R1.2.1 All handler logic, state management, and side effects (e.g., `FileReader`, `fetch`, etc.) MUST live in custom hooks or business/repository layers.
R1.2.2 React components must only orchestrate hooks and sub-components.
R1.2.3 Failing to extract logic to a hook before requesting a commit is a violation of the "newspaper" principle and the architecture defined in `PROJECT_SPEC.md`. Always perform this extraction as part of the REFACTOR phase of TDD.

R1.3 You MUST use shadcn/ui components for all UI elements as specified in the `PROJECT_SPEC.md`. Raw HTML/DOM tags (like `input`, `button`, `label`) should be replaced with their shadcn equivalents (e.g., `<Input />`, `<Button />`, `<Label />`).

---

## D1. Directory Structure

D1.0 Repo Roots:
D1.0.1 Client root is `src/client/` (all frontend/client code).
D1.0.2 Service root is `src/service/` (all server-side/service code).
D1.0.3 Avoid technical infrastructure folders like `server/` or `web/` within `src/service/`. Service entry points and application setup should reside directly under `src/service/`. Business logic should be organized by domain folders.

D1.1 `domain/` contains pure TypeScript business logic and entity definitions.
D1.2 `data/` contains IO implementations and adapters (HTTP clients, SDK wrappers, DB drivers, file system access). It is injected into repositories and must not contain domain decisions.
D1.3 `repositories/` contains repository interfaces and implementations that orchestrate use-cases and depend on injected `data/` dependencies for IO. Repositories must not directly own low-level IO.
D1.4 `components/` contains React UI components organized by domain context.
D1.4.1 Flat component structure: Place components directly in `src/client/components/` by default.
D1.4.2 Nested component structure: Only use subdirectories (e.g., `src/client/components/TextPreview/`) when a component has multiple tightly related files (e.g., its own hooks, styles, or sub-components).
D1.4.3 Hook placement: Hooks belong in the same directory as the component or domain they serve. Never create a separate `hooks/` subdirectory.
D1.5 Root `src/` organizes by domain folders containing use-cases (for example /billing/make-payment.tsx, /registration/unregister.tsx).

---

## Appendix

### Appendix A — PLAN Template (TDD)

Use this template when the user opts-in to a TDD workflow per P0.0.

```md
Here is the PLAN for Task <number>: "<feature name>"

OUTSIDE-IN FLOW:
<Layer 1> -> <Layer 2> -> <Layer 3> -> ...

PLAN:
1. <Phase name>
   RED:
   - Test name: <business behavior test name>
   - Location: <path/to/test>
   - Intent: <one sentence describing the behavior we’re defining>

   GREEN:
   - Minimal implementation: <one sentence>
   - Files expected to change: <paths>

   COMMIT:
   - Proposed message: feat: <task-id>: <behavior>

   REFACTOR:
   - Candidate refactors (only if needed): <one sentence>
   - Files expected to change: <paths>

   COMMIT (only if refactor happened):
   - Proposed message: feat: <task-id>: refactor: <behavior>

2. <Next Phase name>
   TDD Increment 2
   RED:
   - Test name: <...>
   - Location: <...>
   - Intent: <...>

   GREEN:
   - Minimal implementation: <...>
   - Files expected to change: <...>

   COMMIT:
   - Proposed message: feat: <task-id>: <behavior>

   REFACTOR:
   - Candidate refactors (only if needed): <...>

3. Cleanup & Verification
   - Run all tests
   - Fix linting errors
   COMMIT:
   - Proposed message: feat: <task-id>: cleanup: <behavior>

Do you want me to proceed with this plan?
```

Phase-gating message template (must be used between phases):
```
I have completed Phase <n> (<phase name>).

Summary:
<2–5 sentences describing what changed, what tests were added, and what behavior is now supported.>

I am proceeding to Phase <n+1>: <phase name>.
Do you want me to proceed?
```

### Appendix A.1 — PLAN Template (Non-TDD)

Use this template when the user opts-out of a TDD workflow per P0.0.

```md
Here is the PLAN for Task <number>: "<feature name>"

OUTSIDE-IN FLOW:
<Layer 1> -> <Layer 2> -> <Layer 3> -> ...

PLAN:
1. <Phase name>
   - Goal: <one sentence>
   - Changes: <what files/areas will change>
   - Verification: <how we will verify correctness>

2. <Next Phase name>
   - Goal: <one sentence>
   - Changes: <...>
   - Verification: <...>

3. Cleanup & Verification
   - Run relevant checks/tests (as applicable)
   - Fix linting errors
   - Verify the feature manually (as applicable)

Do you want me to proceed with this plan?
```

### Appendix B — `tdd.log` Entry Template (TDD only)

Use this structure when appending to `tdd.log`. Each section must reference the PLAN step number.
```
GOAL: <use case in business language>
PLAN STEP: <phase.step>

----------------------------------------------------------------------

=== RED PHASE ===
TEST ADDED: <path> - <one-line business expectation>
CHANGESET:
<only the single test added/modified, pasted here>

COMMANDS RUN: <command(s)>
TEST OUTPUT: RED - <brief failure summary>

NEXT STEP: <one sentence describing the smallest change to go green>

=== GREEN PHASE ===
CHANGESET:
<only the minimal production code to pass the test, pasted here>

COMMANDS RUN: <command(s)>
TEST OUTPUT: GREEN - All tests passing

=== COMMIT ===
PROPOSED COMMIT: feat: <task-id>: <behavior>
USER DECISION: <commit? push?>

=== REFACTOR PHASE ===
REFRACTORING NOTES:
<what refactoring happened OR "No refactoring was necessary">

CHANGESET:
<only the refactor diff/code pasted here if refactored>

COMMANDS RUN: <command(s)>
TEST OUTPUT: GREEN - All tests passing

=== COMMIT (REFACTOR) ===
PROPOSED COMMIT: feat: <task-id>: refactor: <behavior>
USER DECISION: <commit? push?>

=== CLEANUP & VERIFICATION ===
- Ran full test suite
- Fixed linting errors
- Verified website/services run

=== COMMIT (CLEANUP) ===
PROPOSED COMMIT: feat: <task-id>: cleanup: <behavior>
USER DECISION: <commit? push?>
```

### Appendix C — Example `tdd.log` Entry (canonical)
```
GOAL: rollback shows decremented current version on system-prompt page
----------------------------------------------------------------------

=== RED PHASE ===
TEST ADDED: src/seo/repositories/systemPromptOverridesRepository.int.test.ts (modified) - expects rollback version to decrease by 1
CHANGESET:
    test('decrements current version', () => {
        const v1 = 'TEST_OVERRIDE_' + Math.random().toString(36).slice(2);
        const e1 = appendOverride(v1, new Date('2025-01-02T03:04:05.000Z'), 'new', 'first save comment');

        expect(e1.value).toBe(v1);
        expect(typeof e1.version).toBe('number');
        expect(e1.version).toBe(1);
    });

COMMANDS RUN: npm test (expected to fail before implementation)
TEST OUTPUT: RED - rollback version is not decremented (was incremented)

NEXT STEP: Modify appendOverride to set version to last.version - 1 on rollback (min 1), both in repository and production server

=== GREEN PHASE ===
- Implemented scoreRepository with Node fs + browser localStorage fallback
- Hooked saveCurrentScores into openAiApi.generateSuggestions
- Added test openAiApi.persist.test.ts to verify stored values and keying by listing_id
- Documented data format and keys in README (SEO Scores Database section)
- Checked off task 88 in tasks.md

COMMANDS RUN: npm test --silent -- --runInBand
TEST OUTPUT: GREEN - All tests passing

=== REFACTOR PHASE ===
- Extracted title score calculation to a new function called scoreTitle
- Moved function scoreTitle, scoreDescription, and scoreTags to a new domain layer file called scorer.ts
```

### Appendix D — Test Naming Examples

Bad examples (do not use):
```
describe('AdobeTypekitClient', () => {
describe('addFontCommand', () => {
test('Should correctly parse tags from the OpenAI response')
test('myFunction should be called with correct arguments')
test('renders slider and handles value change')
test('parseTags() returns valid results')
test('GET /api/scoring creates [store]-seo-scores.json = {} if missing')
test('returns filled-outer svg when requested')
test('fetches filled outer outline svg')
```

Good examples (use this style):
```
describe('Adobe Typekit Client', () => {
describe('Add Font', () => {
test('parses tags')
test('lists new cars for sale')
test('shows prompt temperature slider')
test('saves initial seo scores')
test('saves scores for a unique etsy shop')
test('returns filled-outer image')
```

### Appendix E — Naming and File Structure Examples

Preferred:
```
registration/register.tsx
billing/make-payment.tsx
src/seo/domain/scorer.ts
src/seo/repositories/PromptRepository.ts
```

Avoid:
```
UserView.js
EditableTagListView.tsx
src/seo/utils/htmlencoder.ts
PromptDomain.ts
```
