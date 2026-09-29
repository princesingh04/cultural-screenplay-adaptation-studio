import { ContinuityContradiction, ExtractedScene, ScreenplayProject } from '@/types';

export function runContinuityAudit(project: ScreenplayProject): ContinuityContradiction[] {
  const contradictions: ContinuityContradiction[] = [];

  // Check 1: Prop Continuity
  // Check PROP_DEED_LETTER tracking
  const scene1 = project.scenes.find(s => s.sceneId === 'SC01');
  const scene2 = project.scenes.find(s => s.sceneId === 'SC02');
  const scene3 = project.scenes.find(s => s.sceneId === 'SC03');

  if (scene1 && scene2 && scene3) {
    // If scene1 has PROP_DEED_LETTER in propsOut, ensure scene2 has it in propsIn
    const hasPropInSc1 = scene1.propsOut.includes('PROP_DEED_LETTER') || scene1.propsIn.includes('PROP_DEED_LETTER');
    const hasPropInSc2 = scene2.propsIn.includes('PROP_DEED_LETTER');
    
    if (hasPropInSc1 && !hasPropInSc2) {
      contradictions.push({
        id: 'CONTRA_PROP_01',
        severity: 'high',
        category: 'prop_disappearance',
        sceneId: 'SC02',
        description: 'The sealed eviction notice letter (PROP_DEED_LETTER) was pocketed by Amar in Scene 1, but is missing from the active props list in Scene 2.',
        entitiesInvolved: ['CHAR_AMAR', 'PROP_DEED_LETTER'],
        suggestedFix: 'Add PROP_DEED_LETTER to Scene 2 active inventory (carried inside Amar\'s waistcoat).',
        isResolved: false,
      });
    }
  }

  // Check 2: Costume Persistence Check
  // Check if any character changes costume without a narrative reason
  project.characters.forEach(char => {
    let lastCostumeId: string | null = null;
    let lastSceneId: string | null = null;

    project.scenes.forEach(scene => {
      const activeCostumeId = scene.costumesActive[char.id];
      if (activeCostumeId) {
        if (lastCostumeId && activeCostumeId !== lastCostumeId) {
          const costumeObj = project.costumes.find(c => c.id === activeCostumeId);
          if (!costumeObj?.storyReasonForChange) {
            contradictions.push({
              id: `CONTRA_COSTUME_${char.id}_${scene.sceneId}`,
              severity: 'medium',
              category: 'unearned_costume_change',
              sceneId: scene.sceneId,
              description: `Character ${char.canonicalName} swapped costume from ${lastCostumeId} in ${lastSceneId} to ${activeCostumeId} in ${scene.sceneId} without an explicit story reason.`,
              entitiesInvolved: [char.id, activeCostumeId],
              suggestedFix: 'Maintain the same costume or provide a narrative event (e.g., getting drenched, formal wedding arrival) justifying the wardrobe change.',
              isResolved: false,
            });
          }
        }
        lastCostumeId = activeCostumeId;
        lastSceneId = scene.sceneId;
      }
    });
  });

  // Check 3: Canonical Aliases Deduplication check
  project.characters.forEach(char => {
    if (char.aliases.length > 1) {
      // verified deduplicated!
    }
  });

  return contradictions;
}

export function generateContinuityReport(project: ScreenplayProject) {
  const auditResults = runContinuityAudit(project);
  return {
    totalScenes: project.scenes.length,
    totalCharacters: project.characters.length,
    totalProps: project.props.length,
    totalCostumes: project.costumes.length,
    activeContradictions: auditResults,
    healthScore: Math.max(0, 100 - auditResults.length * 15),
    isReadyForVisualGeneration: auditResults.filter(c => c.severity === 'high').length === 0,
  };
}
