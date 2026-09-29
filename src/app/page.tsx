'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { UploadStage } from '@/components/UploadStage';
import { SceneBreakdownStage } from '@/components/SceneBreakdownStage';
import { SideBySideEditorStage } from '@/components/SideBySideEditorStage';
import { VisualBibleStage } from '@/components/VisualBibleStage';
import { ExportStage } from '@/components/ExportStage';
import { AudioAuditionStage } from '@/components/AudioAuditionStage';
import { SAMPLE_SCREENPLAYS } from '@/data/sampleScreenplays';
import { extractScreenplayToProject } from '@/services/extractor';
import { ScreenplayProject, ScriptDialogueLine } from '@/types';
import { runContinuityAudit } from '@/services/continuityEngine';

export default function Home() {
  const [project, setProject] = useState<ScreenplayProject>(() => {
    return extractScreenplayToProject(
      SAMPLE_SCREENPLAYS[0].rawText,
      'The Ancestral Deed',
      'majhi_punjab',
      'rural',
      'romanized'
    );
  });

  const [currentStage, setCurrentStage] = useState<number>(1);
  const [auditionLine, setAuditionLine] = useState<ScriptDialogueLine | null>(null);

  const contradictions = runContinuityAudit(project);

  const handleAuditionLineFromEditor = (line: ScriptDialogueLine) => {
    setAuditionLine(line);
    setCurrentStage(5);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Studio Header Bar */}
      <Navbar
        currentStage={currentStage}
        setCurrentStage={setCurrentStage}
        project={project}
        activeContradictionsCount={contradictions.length}
      />

      {/* Main Studio Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStage === 1 && (
          <UploadStage
            project={project}
            setProject={setProject}
            onProceed={() => setCurrentStage(2)}
          />
        )}

        {currentStage === 2 && (
          <SceneBreakdownStage
            project={project}
            setProject={setProject}
            onProceed={() => setCurrentStage(3)}
          />
        )}

        {currentStage === 3 && (
          <SideBySideEditorStage
            project={project}
            setProject={setProject}
            onProceed={() => setCurrentStage(4)}
            onAuditionLine={handleAuditionLineFromEditor}
          />
        )}

        {currentStage === 4 && (
          <VisualBibleStage
            project={project}
            setProject={setProject}
            onProceed={() => setCurrentStage(5)}
          />
        )}

        {currentStage === 5 && (
          <div className="space-y-8">
            <AudioAuditionStage
              project={project}
              activeLine={auditionLine}
            />
            <ExportStage
              project={project}
              onBackToStudio={() => setCurrentStage(3)}
            />
          </div>
        )}
      </main>

      {/* Studio Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Cultural Screenplay & Visual Adaptation Studio • OTT AI Director Engineering Assignment
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-amber-400/90 font-medium">Safe Autonomy</span>
            <span>•</span>
            <span>Deterministic Continuity Engine</span>
            <span>•</span>
            <span>Production Grade</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
