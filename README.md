# Etsy Listing Generator

An AI-powered tool for Etsy sellers to generate consistent product listing images and details.

## Recent Technical Improvements (Solution Summary)

### Resilient Image Generation
- **Model Selection**: Uses `gemini-3-pro-image-preview` as the primary engine for high-fidelity product imagery.
- **Automatic Fallback**: If the primary model is overloaded (HTTP 503), the system automatically retries with `imagen-4.0-generate-001`.
- **Request Optimization**: Generates images one at a time with `count: 1` to ensure model focus and reliability.
- **Identity Lock**: System prompts are strictly aligned with an "IDENTITY LOCK" rule to preserve product geometry, materials, and colors.

### Robust Response Processing
- **Deep Image Extraction**: Implemented `findImageDeep`, a recursive search algorithm that scans the entire Gemini response for image data (inline base64 or URLs), making the system resilient to varying model output formats.
- **Recursion Protection**: Response parsing includes circular reference detection (using `Set`) and a strict recursion depth limit (10 levels) to prevent memory leaks or hangs.
- **API Reliability**: All production API calls (Gemini and internal backend calls) are wrapped with a 15-second timeout to ensure the application fails gracefully rather than hanging.

### UI & Error Handling
- **Real-time Feedback**: The UI provides immediate status updates (e.g., "Gemini is overloaded, retrying with Imagen...") to keep the user informed during fallbacks.
- **Enhanced Error Logging**: Backend errors are logged with full stack traces and status codes to simplify troubleshooting.
- **Request Guarding**: The generation button is disabled during active requests to prevent redundant API calls.

### Testing Infrastructure
- **Global Timeout**: Jest is configured with a 15-second global timeout for integration tests.
- **Domain-Driven Tests**: Test suites use domain-specific language (e.g., "fake" instead of "mock") and avoid simulated behaviors in favor of real API interactions where appropriate.

## Features
- **Shot Types**: Supports Hero, Lifestyle, Close-up, Flat lay, Macro, and Contextual shots.
- **System Prompt Pane**: Resizable UI element to inspect the AI's internal instructions.
- **Listing Management**: View, copy to clipboard, or download all generated images as a ZIP file.

## Technical Architecture
- **Frontend**: React + TypeScript (Humble View pattern).
- **Backend**: Koa.js + TypeScript (Onion Architecture: Controller → Command → Repository → Data Layer).
- **Coding Style**: Strictly functional modules using factory functions.
- **Prompts**: All AI requests use the [TOON format](https://github.com/toon-format/toon).

## Development
- **Prerequisites**: `GEMINI_API_KEY` in `.env`.
- **Run**: `yarn dev` (Starts both client and server).
- **Test**: `yarn test`.
