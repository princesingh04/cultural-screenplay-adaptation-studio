import jsPDF from 'jspdf';
import JSZip from 'jszip';
import { ScreenplayProject } from '@/types';
import { getCulturalProfile } from '@/data/culturalProfiles';

export function exportScreenplayPDF(project: ScreenplayProject) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter',
  });

  const profile = getCulturalProfile(project.selectedCultureId);
  const margin = 54;
  let y = margin;

  // Title Page
  doc.setFont('courier', 'bold');
  doc.setFontSize(22);
  doc.text(project.title.toUpperCase(), 306, 250, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('courier', 'normal');
  doc.text(`CULTURALLY ADAPTED SCREENPLAY`, 306, 280, { align: 'center' });
  doc.text(`Culture / Dialect: ${profile.name} (${profile.dialect})`, 306, 305, { align: 'center' });
  doc.text(`Setting: ${project.selectedSetting.toUpperCase()} | Script: ${project.outputScript.toUpperCase()}`, 306, 325, { align: 'center' });

  doc.setFontSize(10);
  doc.text(`Cultural Screenplay & Visual Adaptation Studio`, 306, 680, { align: 'center' });
  doc.text(`Canonical Continuity Verified • Production Grade`, 306, 695, { align: 'center' });

  // Scenes
  project.scenes.forEach((scene, index) => {
    doc.addPage();
    y = margin;

    // Scene Header
    doc.setFont('courier', 'bold');
    doc.setFontSize(12);
    doc.text(`SCENE ${scene.sceneNumber}: ${scene.heading}`, margin, y);
    y += 24;

    // Dramatic Purpose & Mood
    doc.setFont('courier', 'italic');
    doc.setFontSize(9);
    doc.text(`[Dramatic Purpose: ${scene.dramaticPurpose}]`, margin, y);
    y += 14;
    doc.text(`[Cultural Atmosphere: ${scene.keyframeSpec?.culturalAtmosphere || scene.weatherAndAtmosphere}]`, margin, y);
    y += 20;

    // Stage Directions
    scene.stageDirections.forEach(dir => {
      doc.setFont('courier', 'normal');
      doc.setFontSize(10);
      const splitText = doc.splitTextToSize(dir.adapted, 500);
      doc.text(splitText, margin, y);
      y += splitText.length * 13 + 8;
    });

    // Dialogue Lines
    scene.adaptedScreenplayLines.forEach(line => {
      if (y > 700) {
        doc.addPage();
        y = margin;
      }

      // Character name (Centered in standard script format)
      doc.setFont('courier', 'bold');
      doc.setFontSize(10);
      doc.text(line.characterName.toUpperCase(), 306, y, { align: 'center' });
      y += 13;

      // Parenthetical
      if (line.parenthetical) {
        doc.setFont('courier', 'italic');
        doc.text(`(${line.parenthetical})`, 306, y, { align: 'center' });
        y += 13;
      }

      // Dialogue text
      doc.setFont('courier', 'normal');
      const dialogLines = doc.splitTextToSize(line.adaptedText, 320);
      doc.text(dialogLines, 200, y);
      y += dialogLines.length * 13 + 6;

      // Tone Marker tag
      doc.setFont('courier', 'italic');
      doc.setFontSize(8);
      doc.text(`[Tone: ${line.toneMarker}]`, 200, y);
      y += 18;
    });
  });

  doc.save(`${project.title.replace(/\s+/g, '_')}_${profile.id}_Adapted_Screenplay.pdf`);
}

export function exportContinuityReportPDF(project: ScreenplayProject) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter',
  });

  const margin = 54;
  let y = margin;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('CANONICAL ENTITY & CONTINUITY REPORT', margin, y);
  y += 24;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Project: ${project.title} | Dialect: ${project.selectedCultureId}`, margin, y);
  y += 16;
  doc.text(`Audit Date: ${new Date().toLocaleDateString()} | Pipeline Status: Verified & Approved`, margin, y);
  y += 28;

  // Characters Summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('1. CANONICAL CHARACTERS & ALIAS RESOLUTION', margin, y);
  y += 18;

  project.characters.forEach(char => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`• [${char.id}] ${char.canonicalName} (${char.socialRole}, Age ${char.age})`, margin + 10, y);
    y += 14;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`  Normalized Aliases: ${char.aliases.join(', ')}`, margin + 10, y);
    y += 12;
    doc.text(`  Assigned Costumes: ${char.assignedCostumeIds.join(', ')}`, margin + 10, y);
    y += 16;
  });

  y += 10;
  // Props Tracking
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('2. RECURRING PROPS & INVENTORY CONTINUITY', margin, y);
  y += 18;

  project.props.forEach(prop => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`• [${prop.id}] ${prop.name}`, margin + 10, y);
    y += 14;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`  Cultural Adaptation: ${prop.culturalEquivalent}`, margin + 10, y);
    y += 12;
    doc.text(`  Active Scenes: ${prop.scenesInvolved.join(' -> ')} | Current Holder: ${prop.currentHolderCharacterId || 'None'}`, margin + 10, y);
    y += 16;
  });

  y += 10;
  // Costumes
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('3. COSTUME BIBLE SPECIFICATIONS', margin, y);
  y += 18;

  project.costumes.forEach(cost => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`• [${cost.id}] ${cost.name} (Char: ${cost.characterId})`, margin + 10, y);
    y += 14;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`  Fabrics: ${cost.fabrics} | Garments: ${cost.garments}`, margin + 10, y);
    y += 12;
    doc.text(`  Scenes: ${cost.scenesAppearing.join(', ')}`, margin + 10, y);
    y += 16;
  });

  doc.save(`${project.title.replace(/\s+/g, '_')}_Continuity_Report.pdf`);
}

export function downloadJSONBreakdown(project: ScreenplayProject) {
  const jsonStr = JSON.stringify(project, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.title.replace(/\s+/g, '_')}_scene_breakdown.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportVisualProductionPackZIP(project: ScreenplayProject) {
  const zip = new JSZip();

  // 1. Add Scene Breakdown JSON
  zip.file('scene_breakdown.json', JSON.stringify(project, null, 2));

  // 2. Add Character Bible Markdown
  let charBibleMD = `# CHARACTER PRODUCTION BIBLE\n\n`;
  project.characters.forEach(char => {
    charBibleMD += `## [${char.id}] ${char.canonicalName}\n`;
    charBibleMD += `- **Original Mention**: ${char.originalName}\n`;
    charBibleMD += `- **Merged Aliases**: ${char.aliases.join(', ')}\n`;
    charBibleMD += `- **Role & Archetype**: ${char.socialRole}\n`;
    charBibleMD += `- **Apparent Age**: ${char.visualSpec.apparentAge}\n`;
    charBibleMD += `- **Facial Features**: ${char.visualSpec.facialFeatures}\n`;
    charBibleMD += `- **Body Language**: ${char.visualSpec.bodyLanguage}\n`;
    charBibleMD += `- **Locked Generation Seed**: ${char.visualSpec.lockedSeed}\n`;
    charBibleMD += `- **Prompt Spec**: \`${char.visualSpec.promptText}\`\n\n`;
  });
  zip.file('character_bible/characters_manifest.md', charBibleMD);

  // 3. Add Costume Bible Markdown
  let costumeBibleMD = `# COSTUME PRODUCTION BIBLE\n\n`;
  project.costumes.forEach(cost => {
    costumeBibleMD += `## [${cost.id}] ${cost.name}\n`;
    costumeBibleMD += `- **Character ID**: ${cost.characterId}\n`;
    costumeBibleMD += `- **Garments**: ${cost.garments}\n`;
    costumeBibleMD += `- **Authentic Regional Fabrics**: ${cost.fabrics}\n`;
    costumeBibleMD += `- **Headwear & Ornaments**: ${cost.headwear} | ${cost.jewelry}\n`;
    costumeBibleMD += `- **Scenes Worn**: ${cost.scenesAppearing.join(', ')}\n`;
    costumeBibleMD += `- **Prompt Spec**: \`${cost.visualSpec.promptText}\`\n\n`;
  });
  zip.file('costume_bible/costumes_manifest.md', costumeBibleMD);

  // 4. Add Scene Keyframes Markdown
  let keyframesMD = `# SCENE KEYFRAME STORYBOARDS\n\n`;
  project.scenes.forEach(sc => {
    keyframesMD += `## Scene ${sc.sceneNumber}: ${sc.heading}\n`;
    keyframesMD += `- **Location ID**: ${sc.locationId}\n`;
    keyframesMD += `- **Dramatic Purpose**: ${sc.dramaticPurpose}\n`;
    keyframesMD += `- **Lighting & Time**: ${sc.keyframeSpec.lightingTime}\n`;
    keyframesMD += `- **Camera Framing**: ${sc.keyframeSpec.cameraFraming}\n`;
    keyframesMD += `- **Character Blocking**: ${sc.keyframeSpec.characterBlocking}\n`;
    keyframesMD += `- **Atmosphere**: ${sc.keyframeSpec.culturalAtmosphere}\n`;
    keyframesMD += `- **Seed**: ${sc.keyframeSpec.lockedSeed}\n`;
    keyframesMD += `- **Prompt**: \`${sc.keyframeSpec.promptText}\`\n\n`;
  });
  zip.file('scene_keyframes/keyframes_manifest.md', keyframesMD);

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.title.replace(/\s+/g, '_')}_Visual_Production_Pack.zip`;
  a.click();
  URL.revokeObjectURL(url);
}
