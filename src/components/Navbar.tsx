'use client';

import React from 'react';
import { Film, CheckCircle2, AlertTriangle, Layers, BookOpen, Image as ImageIcon, Download, ShieldCheck } from 'lucide-react';
import { ScreenplayProject } from '@/types';
import { getCulturalProfile } from '@/data/culturalProfiles';

interface NavbarProps {
  currentStage: number;
  setCurrentStage: (stage: number) => void;
  project: ScreenplayProject;
  activeContradictionsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStage,
  setCurrentStage,
  project,
  activeContradictionsCount,
}) => {
  const profile = getCulturalProfile(project.selectedCultureId);

  const stages = [
    { id: 1, label: '1. Upload & Culture', icon: BookOpen },
    { id: 2, label: '2. Scene Extraction', icon: Layers },
    { id: 3, label: '3. Screenplay Comparison', icon: Film },
    { id: 4, label: '4. Visual Gallery', icon: ImageIcon },
    { id: 5, label: '5. Continuity & Export', icon: Download },
  ];

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top brand & status row */}
        <div className="flex items-center justify-between h-14">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-700/80 flex items-center justify-center text-zinc-100 font-mono text-xs font-bold">
              CS
            </div>
            <div className="flex items-center space-x-2.5">
              <span className="font-semibold text-sm tracking-tight text-zinc-100">
                CULTURAL ADAPTATION STUDIO
              </span>
              <span className="text-zinc-600">/</span>
              <span className="text-xs text-zinc-400 font-mono">{project.title}</span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] rounded bg-zinc-900 text-zinc-300 border border-zinc-800 font-mono">
                {profile.dialect}
              </span>
            </div>
          </div>

          {/* Continuity & Health Indicators */}
          <div className="flex items-center space-x-3 text-xs">
            {activeContradictionsCount === 0 ? (
              <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 rounded-md font-mono text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Continuity Verified</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-amber-950/40 border border-amber-500/30 text-amber-300 rounded-md font-mono text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>{activeContradictionsCount} Contradiction{activeContradictionsCount > 1 ? 's' : ''}</span>
              </div>
            )}

            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-md font-mono text-[11px]">
              <ShieldCheck className="w-3 h-3 text-zinc-400" />
              <span>{project.characters.length} Canonical IDs</span>
            </div>
          </div>
        </div>

        {/* Studio Pipeline Stages */}
        <nav className="flex space-x-1 overflow-x-auto py-1.5 border-t border-zinc-900 scrollbar-none">
          {stages.map(stage => {
            const Icon = stage.icon;
            const isActive = currentStage === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => setCurrentStage(stage.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-zinc-800 text-zinc-100 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-zinc-200' : 'text-zinc-500'}`} />
                <span>{stage.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
