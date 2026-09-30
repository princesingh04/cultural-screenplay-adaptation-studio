# Engineering Lessons & Self-Correction Log

This file tracks every operational and architectural lesson learned during development to prevent regressions and improve system resilience.

---

### Lesson 1: Avoid Aggressive Client Abort Timeouts on Generative LLM Requests
- **Mistake**: `UploadStage.tsx` had a `setTimeout(() => controller.abort(), 3500)` (3.5 seconds). Complex multi-scene screenplay adaptations with full dialogue, cultural rationales, and continuity tracking require 15–45 seconds.
- **Consequence**: The client aborted the fetch at 3.5s and immediately fell back to the hardcoded sample in 5ms, making it look like the app was bypassing the AI entirely.
- **Rule**: Set realistic client-side timeouts (60–120s) for end-to-end LLM generative pipelines and always show dynamic loading indicators.

---

### Lesson 2: Never Silently Swallow API Failures into Mock Data
- **Mistake**: When `fetch('/api/adapt')` aborted or failed, the `catch` block silently swallowed the exception and substituted hardcoded mock data without notifying the user or console.
- **Rule**: Always log errors clearly and surface informative status messages to the user so failures are immediately diagnosed rather than masked.

---

### Lesson 3: Guard Against LLM Max Output Token Truncation in Structured JSON
- **Mistake**: Generative prompts with comprehensive schemas (scenes, dialogues, tone markers, rationales, props, costumes) can produce over 4,000–8,000 tokens. Without specifying `maxOutputTokens: 8192`, output was truncated mid-string, causing `JSON.parse` syntax crashes.
- **Rule**: Always configure high output token limits (`maxOutputTokens: 8192` or higher) and wrap JSON parsing with an automatic bracket/string repair routine to recover partially truncated streams.

---

### Lesson 4: Multi-Provider Redundancy for Zero-Downtime Generation
- **Mistake**: Relying solely on a single model endpoint that can experience sudden Google AI Studio 503 "High Demand" spikes.
- **Rule**: Implement cascading redundancy: Primary model (Gemini) $\rightarrow$ Secondary provider (Together AI Llama 3.3 70B Turbo) $\rightarrow$ Deterministic offline parser.

---

### Lesson 5: Ensure Fallback Parsers Handle Arbitrary Scripts Dynamically
- **Mistake**: The offline fallback extractor was defaulting to a specific test project (`getAncestralDeedProject`) if input didn't match pre-baked keywords.
- **Rule**: Build generic parsing logic that extracts scenes, character headings, and props from arbitrary user text so custom scripts always reflect their own entities.

### Lesson 6: Never Populate Brand-New Script Entities with Reused Mock Assets
- **Mistake**: When creating the sample project for the new test screenplay "The Heirloom Ledger", `imageUrl` fields were populated with `/images/characters/amar.webp`, `meera.webp`, etc. from the previous script.
- **Consequence**: When the user loaded and extracted the new script, the Visual Bible immediately displayed the previous characters' faces, making it look like images were pre-fed and the AI was not generating anything.
- **Rule**: For new/custom scripts, `imageUrl` MUST default to `undefined` (or a distinctive pending placeholder state) with explicit "Generate Visual (FLUX)" action triggers, clearly demarcating pending assets from generated assets.

---

### Lesson 7: Explicit Error Bubbling in Visual Regeneration Workflows
- **Mistake**: `VisualBibleStage.tsx` caught API failures in `fetch('/api/generate-image')` and quietly preserved the previous image, closing the modal in 200ms without showing an error message.
- **Consequence**: If Together AI returned an error (e.g., dimension restrictions, network, or billing), the UI closed immediately and kept the old pre-fed asset, misleading the user into thinking the button was either broken or returning an instant hardcoded image.
- **Rule**: Always capture API error responses, leave the configuration modal open with an explicit error alert, and display retry status badges on individual visual cards.

---

### Lesson 8: Clear Conversion Feedback & Transparent Asset Generation States
- **Problem**: When adapting screenplays or generating visual assets, an instant transition or silence makes users wonder whether an AI model is truly running or if pre-cached assets are being displayed.
- **Rule**:
  1. Always render an animated in-progress progress card with live elapsed seconds, phase descriptions, estimated duration guidance (~15–35s), and reassurance ("please have patience while the AI models translate regional nuances").
  2. Default all character, costume, and keyframe images to ungenerated (`undefined` or `null`). Provide a prominent "Generate Picture" button, which flips to "Regenerate Picture" only once FLUX generation completes.
  3. Never run automated tests against paid image generation APIs without explicit user consent.

---

### Lesson 9: Mobile Ergonomics & Screenplay Split-Screen Adaptability
- **Problem**: Screenplays and production bibles have high information density. On mobile viewports (<640px), 2-column side-by-side comparisons squash dialogue into unreadable 150px columns, fixed header rows overflow, and modal dialogs get occluded by virtual keyboards.
- **Rule**:
  1. In `Navbar.tsx`, use responsive brand abbreviations ("CULTURAL STUDIO" on small screens), hide secondary meta tags, and make the 5-stage pipeline touch-scrollable with edge-to-edge negative margins (`-mx-3 px-3`).
  2. In `SideBySideEditorStage.tsx`, provide a mobile segmented control (`[Adapted Script] | [Source Script] | [Both (Stacked)]`) so mobile users can focus on reading adapted dialogue comfortably.
  3. In all modals (`ApiSettingsModal`, `MergeModal`, `PromptModal`), enforce `max-h-[90vh] overflow-y-auto` and generous padding so action buttons remain accessible with mobile on-screen keyboards.

---

### Subagent Delegation Guidance
- For large architectural refactors, bulk file generation, or exhaustive multi-model benchmarking, spawn dedicated subagents to parallelize work and maintain a clean primary task execution context.