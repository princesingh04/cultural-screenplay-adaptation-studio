# Known Limitations & Roadmap
**Cultural Screenplay and Visual Adaptation Studio**

---

## 1. Current Limitations

1. **Client-Side Speech Synthesis Dialects**:
   - The Audio Audition stage utilizes the browser's standard Web Speech API with regional pitch and speed modulation. While phonetic markers are transliterated, true regional dialect TTS models (e.g. specialized Indic TTS trained on Majhi or Marwari accents) require specialized external API pipelines.
2. **Dynamic Multi-Actor Visual Interaction**:
   - Scene keyframes currently define composite blocking prompts. In extreme complex scenes with 10+ characters, diffusion models can suffer from attribute bleeding (e.g., turban color transferring to another character). ControlNet or reference-guided inpainting is recommended for film production scaling.
3. **Complex Nested Kinship Networks**:
   - While primary kinship terms (paternal uncle, elder brother, matriarch) are modeled, intricate sub-caste or village-specific matrimonial kinship nuances are currently approximated to the broader sub-region profile.

---

## 2. Future Engineering Roadmap
- [ ] Integration with specialized indic voice synthesis models (AI4Bharat / Bhashini API).
- [ ] Full Fountain format file drag-and-drop parser with live AST validation.
- [ ] Multi-culture side-by-side comparison mode (e.g. comparing Majhi vs Marwari adaptations simultaneously on the same screen).
- [ ] Automated video keyframe animator using Wan2.1 / SVD video pipelines.
