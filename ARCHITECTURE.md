# System Architecture
**Cultural Screenplay and Visual Adaptation Studio**

---

## 1. Architectural Philosophy
The Studio is designed around **Deterministic Safety, Cultural Groundedness, and Continuity Assurance**. Rather than treating screenplay transcreation as a single monolithic LLM prompt, the system separates extraction, canonical normalization, cultural planning, and visual generation into verifiable, inspectable stages with human-in-the-loop approval gates.

```
                    ┌────────────────────────────┐
                    │    Neutral Screenplay      │
                    │      (TXT/PDF/Paste)       │
                    └─────────────┬──────────────┘
                                  │
                                  ▼
                    ┌────────────────────────────┐
                    │  Scene & Entity Extractor  │
                    │   - Aliases Normalized     │
                    │   - Canonical IDs Created  │
                    │   - Cross-Scene Inventory  │
                    └─────────────┬──────────────┘
                                  │
                                  ▼
                    ┌────────────────────────────┐
                    │  Continuity Audit Guard    │◄─── Contradiction Detection
                    │  (Props, Wardrobe, State)  │     (Disappearing props /
                    └─────────────┬──────────────┘      unearned costume swaps)
                                  │
                         [Human Approval Gate]
                                  │
                                  ▼
                    ┌────────────────────────────┐
                    │ Cultural Adaptation Engine │
                    │ - Dialect & Kinship Engine │
                    │ - Non-Verbal & Tone Marker │
                    │ - Cultural Decision Log    │
                    └─────────────┬──────────────┘
                                  │
                                  ▼
           ┌──────────────────────┴──────────────────────┐
           ▼                                             ▼
┌────────────────────────────┐               ┌────────────────────────────┐
│ Side-by-Side Script Studio │               │  Visual Production Bible   │
│ - Synchronized Scroll      │               │  - Character Bible (Seed)  │
│ - Inline Commentary Cards  │               │  - Costume Sheets          │
│ - Audio Cadence Audition   │               │  - 16:9 Scene Keyframes    │
└──────────┬─────────────────┘               └───────────┬────────────────┘
           │                                             │
           └──────────────────────┬──────────────────────┘
                                  │
                                  ▼
                    ┌────────────────────────────┐
                    │    Multi-Format Exporter   │
                    │ - Formatted Screenplay PDF │
                    │ - Continuity Report PDF    │
                    │ - scene_breakdown.json     │
                    │ - Production Pack ZIP      │
                    └────────────────────────────┘
```

---

## 2. Core Subsystems

### A. Canonical Identity & Entity Normalization Engine (`src/services/extractor.ts`)
- **Problem**: Screenplays frequently reference characters by varied names, honorifics, or roles (e.g., *"Amar"*, *"the elder son"*, *"A. Singh"*). A naive visual generator generates separate actors for each alias.
- **Solution**: Normalizes all variants into an immutable canonical record (`CHAR_AMAR`).
- Reusable entities (`COST_AMAR_01`, `PROP_DEED_LETTER`, `LOC_COURTYARD`) preserve state across scenes.

### B. Continuity Conflict Detection (`src/services/continuityEngine.ts`)
- **Prop Tracking**: Ensures items carried out of a scene enter the next scene or are recorded as consumed.
- **Costume Persistence**: Flags any wardrobe change unless a narrative reason is registered.
- **Health Score**: Computes project continuity readiness, requiring resolution before unlocking production deliverables.

### C. Cultural Transcreation Engine (`src/services/adapter.ts`)
- Translates neutral dialogue into region-specific dialects (Majhi Punjabi, Malwai, Marwari, Mewari, Bangru Haryanvi, Awadhi).
- Generates **Cultural Decision Rationale** for every adapted line.
- Assigns non-verbal behavior (e.g. bowing touching feet vs. hand raised to forehead at chaupal).

### D. Visual Production Bible Pipeline (`src/services/visualSpecGenerator.ts`)
- **Character Bible**: Locked seeds, face morphology, and lighting tokens.
- **Costume Bible**: Garment layer breakdown, authentic textiles, and color swatches.
- **Scene Storyboard**: 16:9 widescreen framing, character blocking, and lighting conditions.
- **Modular Asset Retry**: Allows regenerating single images without rebuilding the project state.

### E. Dialect Audio Audition Room (`src/components/AudioAuditionStage.tsx`)
- Integrates the Web Speech API with regional pitch, rate, and rhythm modulation.
- Provides real-time animated waveform visualizers for auditioning dialogue cadence.

### F. Multi-Format Exporter (`src/services/exporter.ts`)
- Generates formatted Hollywood/Indian standard Courier screenplay PDFs using `jspdf`.
- Generates formal Continuity Audit Reports.
- Downloads structured `scene_breakdown.json`.
- Compresses visual manifests and data into a production `.zip` package via `jszip`.
