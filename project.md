# Cultural Screenplay and Visual Adaptation Studio
**OTT Dialect Platform | AI Engineering Challenge**

---

## 1. Challenge Overview
Build a working web application that accepts a short screenplay (3–5 pages, 3–5 scenes) and recreates it inside a selected Indian culture and dialect, producing an adapted screenplay and a consistent visual production pack.

The user specifies:
- Exact culture or dialect (e.g., Majhi, Malwai, Bangru, Marwari, Mewari — not broad labels like "North Indian" or "Rajasthani")
- Region
- Setting: Rural vs. Urban
- Output writing script (e.g., Gurmukhi, Devanagari, Latin/Romanized phonetic, etc.)

### Core Success Criteria
- **Deep Cultural Transformation**: Beyond simple word translation or cosmetic costume changes. If dialogue is hidden, visuals (architecture, attire, props, body language) should clearly identify the culture. If visuals are hidden, verbal nuances (kinship terms, idioms, humor, rhythm, politeness levels) must convey the dialect and culture.
- **Story Preservation**: Dramatic arc, conflict, character motivations, and core relationships must remain intact unless a cultural difference justifies a specific, logged divergence.
- **Continuity & Entity Tracking**: Strict canonical tracking of characters, costumes, props, locations, injuries, and knowledge across scenes. Avoid duplicate entities, unprompted costume swaps, or vanishing props.

---

## 2. What Must Be Adapted

| Dimension | Key Considerations |
| :--- | :--- |
| **Verbal** | Dialect, idioms, kinship terminology, honorifics, humor style, cadence/rhythm, politeness levels, code-switching. |
| **Non-verbal** | Gestures, postures, eye contact norms, physical touch boundaries, silence, greeting rituals, seating hierarchies, dining customs, personal space. |
| **Characters** | Names, caste/class dynamics, occupations, familial roles, demeanor, emotional restraint vs. expressiveness, social expectations. |
| **Visual World** | Vernacular architecture, interior styling, textiles, color palettes, traditional jewelry, grooming, props, authentic cuisine, local transport, landscapes. |
| **Story World** | Community influences, local conflicts, social stakes, rituals/festivals, soundscapes, regional atmosphere. |
| **Cultural Precision** | Region-specific practices; explicit handling of cultural uncertainty; zero accidental contamination across distinct traditions. |

---

## 3. Product Flow & Architecture

```
[ 1. Upload & Parse ]
        │
        ▼
[ 2. Culture & Dialect Selection ]
        │
        ▼
[ 3. Scene-by-Scene Extraction & Normalization ]
     ├── Canonical Characters (Merge aliases)
     ├── Production Elements (Costumes, Props, Locations)
     └── Continuity & State Tracking (State before/after scene)
        │
        ▼
[ 4. Human Review & Approval Gate ] ── (Edit/Merge/Approve)
        │
        ▼
[ 5. Cultural Adaptation Planning ] ── (Explicit justification of changes)
        │
        ▼
[ 6. Screenplay Rewrite & Visual Pack Generation ]
     ├── Screenplay: Side-by-side comparison, native dialogue & stage directions
     ├── Character Bible: Canonical ID, descriptions, consistent reference visuals
     ├── Costume Bible: Garments, fabrics, headwear, jewelry per scene variant
     └── Scene Keyframes: Architectural context, blocking, lighting, atmosphere
        │
        ▼
[ 7. Verification, Continuity Audit & Export ]
```

---

## 4. Minimum Application Screens
1. **Upload & Culture Selection**: Input text/PDF/DOCX; specify exact dialect, region, urban/rural, script.
2. **Scene Extraction & Entity Breakdown**: Editable structured table showing scenes, characters, props, locations, and continuity states.
3. **Character & Costume Approval (Gate)**: Deduplication/merge tools, canonical ID assignment, cultural plan review before triggering expensive image pipelines.
4. **Adapted Screenplay Comparison**: Side-by-side view of original vs. adapted script with change rationales.
5. **Visual Gallery**: Interactive gallery organized by characters, costumes, and scene keyframes linked to canonical IDs.
6. **Continuity & Export Center**: Contradiction checker, warnings, and bundled exports (JSON breakdown, adapted script PDF, visual asset packages).

---

## 5. Agentic AI Engineering Expectations
- **Structured Memory**: Deterministic schemas for entities, scenes, and continuity states.
- **Verification & Guards**: Automated checks to detect contradictions (e.g., an item carried out of Scene 2 disappearing in Scene 3).
- **Human-in-the-Loop**: Approval checkpoints before expensive visual generation.
- **Modular Retries**: Ability to re-adapt or regenerate single assets without recalculating the entire pipeline.
- **Traceability**: Audit log connecting adapted lines and generated visual prompts back to source scenes and cultural rationale.
- **Graceful Failure & Uncertainty Handling**: Flag low-confidence cultural assumptions for user correction.

---

## 6. Evaluation Criteria & Deliverables
- **Extraction & Continuity (25%)**: Accuracy of structured records, state tracking, and contradiction detection.
- **Cultural Adaptation (20%)**: Depth of verbal and non-verbal adaptation without generic stereotyping.
- **Visual Consistency (20%)**: Reusable canonical identity, consistent character faces/wardrobes across keyframes.
- **Working Product & UX (15%)**: Smooth interactive user journey with intuitive review gates.
- **Entity Deduplication (10%)**: Clean normalization of aliases and shared assets.
- **Code Quality & Documentation (10%)**: Clean codebase, automated tests, clear architectural overview, and documented limitations.

### Standard Deliverable Directory Layout
```
submission/
├── README.md
├── ARCHITECTURE.md
├── AI_USAGE.md
├── KNOWN_LIMITATIONS.md
├── app/
├── tests/
└── sample_output/
    ├── adapted_screenplay.pdf
    ├── scene_breakdown.json
    ├── continuity_report.pdf
    ├── character_bible/
    ├── costume_bible/
    ├── scene_keyframes/
    └── demo_video.mp4
```
