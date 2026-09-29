# Cultural Screenplay and Visual Adaptation Studio
**OTT Dialect Platform | AI Engineering Challenge**

A production-grade web studio that accepts a neutral screenplay (3–5 scenes) and transcreates it into an exact Indian regional culture and dialect, generating a culturally anchored screenplay, deterministic continuity tracking, and a comprehensive visual & audio production pack.

---

## 🌟 Key Features

1. **Exact Cultural & Dialect Precision**:
   - Deep dialect profiles for **Majhi Punjabi**, **Malwai Punjabi**, **Marwari Rajasthani**, **Mewari Rajasthani**, **Bangru Haryanvi**, and **Awadhi UP**.
   - Verbal adaptations: Authentic idioms, kinship terminology, honorific hierarchies, and humor styles.
   - Non-verbal adaptations: Authentic greeting gestures, seating hierarchy, dining customs, and personal space.
   - Vernacular visual world: Region-specific architecture, textiles, jewelry, props, and landscapes.

2. **Canonical Identity & Entity Deduplication**:
   - Merges disparate script mentions (e.g., *"Amar"*, *"the elder son"*, *"A. Singh"*) into a single canonical ID (`CHAR_AMAR`).
   - Ensures stable visual identity across multiple scenes without duplicate character generations.

3. **Deterministic Continuity Engine**:
   - Tracks cross-scene prop inventories (e.g., tracking the eviction notice envelope from Scene 1 through Scene 3).
   - Monitors costume persistence and flags unearned wardrobe changes.
   - Automated contradiction detection with instant auto-resolve tools.
   - Human approval gate before visual generation.

4. **Interactive Side-by-Side Screenplay Studio**:
   - Dual split-screen comparing original neutral script with culturally adapted script.
   - Inline **Cultural Decision Rationale** badges explaining linguistic and cultural choices.
   - Tone markers (e.g., *"Maternal Authority"*, *"Stifled Urgency"*, *"Brisk Urban Entitlement"*).
   - Script mode switcher (Romanized Phonetic, Gurmukhi, Devanagari).
   - Real-time inline script line editing.

5. **Culturally Anchored Visual Production Bible**:
   - **Character Bible**: Reference portraits, facial morphology, locked generation seeds, and prompt specifications.
   - **Costume Bible**: Garment breakdown, authentic handloom fabrics, color swatches, and ornaments.
   - **Scene Storyboards**: 16:9 widescreen cinematic framing, character blocking, lighting, and cultural ambiance.
   - **Modular Asset Retry**: Ability to tweak and regenerate single failed assets without rebuilding the project.

6. **Regional Dialect Audio Audition Room**:
   - Web Speech API integration with regional pitch, speed, and cadence modulation.
   - Animated real-time waveform visualizer for dialogue lines.

7. **Multi-Format Production Export Hub**:
   - Standard Courier Hollywood/Indian Screenplay PDF (`jspdf`).
   - Canonical Entity & Continuity Audit Report PDF (`jspdf`).
   - Structured Scene Breakdown JSON (`scene_breakdown.json`).
   - Visual Production Pack ZIP bundle (`jszip`).

---

## 🚀 Quick Setup & Installation

### Requirements
- Node.js 18+ (tested on Node v24.19.0)
- npm 9+

### Installation
```bash
# 1. Clone repository & install dependencies
git clone <repo-url>
cd assignment3
npm install

# 2. Start the development server
npm run dev

# 3. Open in your browser
http://localhost:3000
```

### Production Build & Automated Tests
```bash
# Build production bundle
npm run build

# Run automated continuity and deduplication test suite
node tests/runTests.js
```

---

## 📁 Repository & Submission Layout

```
assignment3/
├── ARCHITECTURE.md          # Comprehensive architectural & subsystem breakdown
├── AI_USAGE.md              # AI agentic usage log & verification process
├── KNOWN_LIMITATIONS.md     # Edge cases & future roadmap
├── README.md                # System documentation & setup guide
├── project.md               # Extracted brief from original challenge PDF
├── assignment_cultural_screenplay_visual_adaptation_studio.pdf # Official brief
├── package.json
├── src/
│   ├── app/                 # Next.js App Router (page.tsx, layout.tsx, globals.css)
│   ├── components/          # Studio UI stages & interactive editors
│   ├── data/                # Cultural profiles & sample screenplays
│   ├── services/            # Extractor, continuity engine, adapter, exporter
│   └── types/               # Full TypeScript schemas
├── tests/
│   └── runTests.js          # Automated continuity & deduplication test runner
└── sample_output/
    ├── scene_breakdown.json # Structured JSON conforming to challenge schema
    ├── character_bible/     # Character production bible manifest
    ├── costume_bible/       # Costume department specifications
    └── scene_keyframes/     # 16:9 storyboard keyframes manifest
```
