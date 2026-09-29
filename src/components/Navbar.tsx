'use client';

import React from 'react';
import { Film, CheckCircle2, AlertTriangle, Layers, BookOpen, Image as ImageIcon, Volume2, Download, Sparkles } from 'lucide-react';
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
    { id: 1, label: '1. Script & Dialect', icon: BookOpen },
    { id: 2, label: '2. Scene Breakdown & Normalization', icon: Layers },
    { id: 3, label: '3. Side-by-Side Adaptation', icon: Film },
    { id: 4, label: '4. Visual Production Bible', icon: ImageIcon },
    { id: 5, label: '5. Audio Audition & Export', icon: Volume2 },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-600 to-rose-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-amber-200 via-orange-300 to-rose-200 bg-clip-text text-transparent">
                  CULTURAL ADAPTATION STUDIO
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full">
                  OTT AI Director
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center space-x-2">
                <span>{project.title}</span>
                <span>•</span>
                <span className="text-amber-400 font-medium">{profile.name}</span>
                <span>•</span>
                <span className="capitalize">{project.selectedSetting}</span>
              </div>
            </div>
          </div>

          {/* Continuity Status Badge */}
          <div className="hidden md:flex items-center space-x-3">
            {activeContradictionsCount === 0 ? (
              <div className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Continuity Verified (0 Contradictions)</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 px-3 py-1 bg-rose-950/60 border border-rose-500/30 text-rose-400 rounded-full text-xs font-medium animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{activeContradictionsCount} Continuity Issues</span>
              </div>
            )}

            <div className="flex items-center space-x-1.5 px-3 py-1 bg-slate-900 border border-slate-700 text-slate-300 rounded-full text-xs font-mono">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>4 Canonical Entities</span>
            </div>
          </div>
        </div>

        {/* Studio Pipeline Navigation Tabs */}
        <div className="flex space-x-1 border-t border-slate-800/80 overflow-x-auto py-2 scrollbar-none">
          {stages.map(stage => {
            const Icon = stage.icon;
            const isActive = currentStage === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => setCurrentStage(stage.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300 shadow-sm shadow-amber-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{stage.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
