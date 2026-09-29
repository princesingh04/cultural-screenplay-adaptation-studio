# AI Usage Log & Agentic Methodology
**Cultural Screenplay & Visual Adaptation Studio**

---

## 1. Overview of AI Assistance
This application was engineered using an agentic AI pair programming methodology. AI was employed across structural extraction, cultural knowledge modeling, dialect translation, and visual image generation.

---

## 2. Where AI Was Used

| Task / Domain | Role of AI | Human Oversight / Guardrails |
| :--- | :--- | :--- |
| **Structured Screenplay Parsing** | Scene breakdown and entity candidate extraction | Deterministic schema validation; manual deduplication approval gate. |
| **Cultural & Dialect Adaptation** | Synthesizing regional idioms, kinship terms, and honorific rules for Majhi, Malwai, Marwari, Bangru, and Awadhi | Every translation requires an explicit **Cultural Decision Rationale** card. |
| **Continuity & Conflict Detection** | Auditing prop transfers, costume swaps, and emotional arcs across scenes | Hardcoded programmatic rule-checkers flag contradictions as actionable alerts. |
| **Visual Asset Generation** | Creating photorealistic character reference portraits and storyboard compositions | Locked seeds, strict prompt specifications, and isolated single-asset retry mechanisms. |

---

## 3. What AI Got Wrong & How It Was Verified
1. **Generic Cultural Flattening**:
   - *Problem*: Initial prompts defaulted to generic "North Indian" tropes (e.g. treating Punjabi and Rajasthani customs interchangeably).
   - *Correction*: Introduced discrete cultural profile schemas (`src/data/culturalProfiles.ts`) requiring micro-region precision (e.g. Majha border belt vs Malwa canal plains; Marwari merchant etiquette vs Mewari Rajput martial lore).
2. **Entity Duplication in Character Generation**:
   - *Problem*: Early generation models treated "the elder son" and "Amar" as separate characters with different faces.
   - *Correction*: Implemented an entity normalization layer that assigns a single canonical ID (`CHAR_AMAR`) and locks generation seeds (`749201`) across all related shots.
3. **Disappearing Props**:
   - *Problem*: The mortgage notice pocketed in Scene 1 disappeared from Scene 2 prompt specifications.
   - *Correction*: Built the `runContinuityAudit` engine to reject generation until cross-scene inventories match.
