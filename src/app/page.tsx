'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { UploadStage } from '@/components/UploadStage';
import { SceneBreakdownStage } from '@/components/SceneBreakdownStage';
import { SideBySideEditorStage } from '@/components/SideBySideEditorStage';
import { VisualBibleStage } from '@/components/VisualBibleStage';
import { ExportStage } from '@/components/ExportStage';
import { ApiSettingsModal } from '@/components/ApiSettingsModal';
import { SAMPLE_SCREENPLAYS } from '@/data/sampleScreenplays';
import { extractScreenplayToProject } from '@/services/extractor';
import { ScreenplayProject } from '@/types';
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
  const [isApiModalOpen, setIsApiModalOpen] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gemini_api_key') || '';
      setApiKey(stored);
    }
  }, []);

  const contradictions = runContinuityAudit(project);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-zinc-800 selection:text-zinc-100">
      {/* Studio Header Bar */}
      <Navbar
        currentStage={currentStage}
        setCurrentStage={setCurrentStage}
        project={project}
        activeContradictionsCount={contradictions.length}
        onOpenApiSettings={() => setIsApiModalOpen(true)}
        hasApiKey={Boolean(apiKey)}
      />

      {/* Main Studio Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
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
          <ExportStage
            project={project}
            onBackToStudio={() => setCurrentStage(3)}
          />
        )}
      </main>

      {/* Clean Studio Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-4 text-xs text-zinc-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Cultural Screenplay & Visual Adaptation Studio • Candidate Brief Specification
          </div>
          <div className="text-zinc-600 text-[11px]">
            Extraction & Continuity • Cultural Adaptation • Visual Pack Generation
          </div>
        </div>
      </footer>

      {/* In-App API Key Modal */}
      <ApiSettingsModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        onApiKeySaved={key => setApiKey(key)}
      />
    </div>
  );
}
