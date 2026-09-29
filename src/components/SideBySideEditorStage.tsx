'use client';

import React, { useState } from 'react';
import { ScreenplayProject, ExtractedScene, ScriptDialogueLine } from '@/types';
import { getCulturalProfile } from '@/data/culturalProfiles';
import { adaptScreenplayLines } from '@/services/adapter';
import {
  Film,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Check,
  Edit3,
  Languages,
  Info,
  Sliders,
  Volume2,
  ChevronDown,
} from 'lucide-react';

interface SideBySideEditorStageProps {
  project: ScreenplayProject;
  setProject: React.Dispatch<React.SetStateAction<ScreenplayProject>>;
  onProceed: () => void;
  onAuditionLine?: (line: ScriptDialogueLine) => void;
}

export const SideBySideEditorStage: React.FC<SideBySideEditorStageProps> = ({
  project,
  setProject,
  onProceed,
  onAuditionLine,
}) => {
  const profile = getCulturalProfile(project.selectedCultureId);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number>(0);
  const [scriptMode, setScriptMode] = useState<'romanized' | 'gurmukhi' | 'devanagari'>('romanized');
  const [editingLineId, setEditingLineId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>('');

  const currentScene = project.scenes[selectedSceneIndex] || project.scenes[0];

  const handleScriptModeChange = (mode: 'romanized' | 'gurmukhi' | 'devanagari') => {
    setScriptMode(mode);
    const updatedScenes = adaptScreenplayLines(project.scenes, project.selectedCultureId, mode);
    setProject(prev => ({
      ...prev,
      outputScript: mode,
      scenes: updatedScenes,
    }));
  };

  const handleSaveEdit = (lineId: string) => {
    setProject(prev => {
      const updatedScenes = prev.scenes.map(sc => ({
        ...sc,
        adaptedScreenplayLines: sc.adaptedScreenplayLines.map(line => {
          if (line.id === lineId) {
            return {
              ...line,
              adaptedText: editText,
            };
          }
          return line;
        }),
      }));
      return {
        ...prev,
        scenes: updatedScenes,
      };
    });
    setEditingLineId(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              STAGE 3 • SIDE-BY-SIDE STUDIO
            </span>
            <span className="text-xs text-slate-400 font-mono">Dialect Transcreation</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Interactive Cultural Screenplay Studio</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Compare source vs adapted lines with inline cultural rationales, tone markers, and regional cadence.
          </p>
        </div>

        {/* Controls: Script switch & Proceed */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <Languages className="w-3.5 h-3.5 text-amber-400 ml-2 mr-1" />
            {(['romanized', 'gurmukhi', 'devanagari'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => handleScriptModeChange(mode)}
                className={`px-3 py-1 rounded-lg capitalize font-medium transition-all ${
                  scriptMode === mode
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={onProceed}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 flex items-center space-x-1.5 shadow-md shadow-amber-500/10 transition-all"
          >
            <span>Proceed to Visual Bible</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Scene Navigation Ribbon */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 overflow-x-auto scrollbar-none">
        {project.scenes.map((scene, idx) => (
          <button
            key={scene.sceneId}
            onClick={() => setSelectedSceneIndex(idx)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-2 ${
              selectedSceneIndex === idx
                ? 'bg-amber-500/15 border border-amber-500/50 text-amber-300 shadow-sm'
                : 'bg-slate-900/60 border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <span className="font-mono text-[10px] text-amber-400/90">{scene.sceneId}</span>
            <span>Scene {scene.sceneNumber}: {scene.heading.split('-')[0]}</span>
          </button>
        ))}
      </div>

      {/* Split-Screen Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Original Neutral Script */}
        <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Source Screenplay (Neutral)</h2>
            </div>
            <span className="text-xs font-mono text-slate-500">English Standard</span>
          </div>

          {/* Scene Header */}
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl font-mono text-xs space-y-2">
            <div className="text-amber-400/80 font-bold">{currentScene.heading}</div>
            <div className="text-slate-400 leading-relaxed text-[11px]">
              {currentScene.stageDirections[0]?.original || 'No stage direction available.'}
            </div>
          </div>

          {/* Original Dialogue List */}
          <div className="space-y-4">
            {currentScene.adaptedScreenplayLines.map((line, idx) => (
              <div key={line.id} className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-300 uppercase tracking-wider font-mono">
                    {line.characterName}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Line {idx + 1}</span>
                </div>
                {line.parenthetical && (
                  <div className="text-slate-400 italic text-xs font-mono">({line.parenthetical})</div>
                )}
                <div className="font-mono text-xs text-slate-200 leading-relaxed pl-2 border-l-2 border-slate-700">
                  &quot;{line.originalText}&quot;
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Culturally Adapted Screenplay */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6 space-y-6 shadow-xl shadow-amber-500/5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
              <h2 className="text-sm font-bold text-amber-300 uppercase tracking-wider">
                Adapted: {profile.name} ({profile.dialect})
              </h2>
            </div>
            <span className="text-xs font-mono text-amber-400/80 capitalize">
              Milieu: {project.selectedSetting}
            </span>
          </div>

          {/* Adapted Stage Directions with Vernacular Flavor */}
          <div className="bg-amber-950/20 border border-amber-500/20 p-4 rounded-xl space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cultural Stage Directions & Vernacular Mise-en-scène</span>
            </div>
            <p className="text-xs text-amber-100 font-serif leading-relaxed">
              {currentScene.stageDirections[0]?.adapted}
            </p>
            <div className="text-[11px] text-amber-400/80 pt-1">
              <strong>Cultural Details:</strong> {currentScene.stageDirections[0]?.culturalDetails}
            </div>
          </div>

          {/* Adapted Dialogue with Inline Commentary & Tone Markers */}
          <div className="space-y-4">
            {currentScene.adaptedScreenplayLines.map((line, idx) => {
              const isEditing = editingLineId === line.id;
              return (
                <div
                  key={line.id}
                  className="p-4 bg-slate-950/80 border border-slate-800/90 rounded-xl space-y-3 hover:border-amber-500/40 transition-all group"
                >
                  {/* Line Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-amber-400 uppercase tracking-wider font-mono">
                        {line.characterName}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        {line.toneMarker}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {onAuditionLine && (
                        <button
                          onClick={() => onAuditionLine(line)}
                          title="Audition dialogue with voice"
                          className="p-1 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-all"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (isEditing) {
                            handleSaveEdit(line.id);
                          } else {
                            setEditingLineId(line.id);
                            setEditText(line.adaptedText);
                          }
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
                      >
                        {isEditing ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Edit3 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Non-verbal gesture or parenthetical */}
                  {line.gestureOrAction && (
                    <div className="text-[11px] text-amber-200/70 italic flex items-center space-x-1.5">
                      <span>• Non-verbal gesture: {line.gestureOrAction}</span>
                    </div>
                  )}

                  {/* Adapted Dialogue Text */}
                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                        className="w-full p-2.5 bg-slate-900 border border-amber-500/50 rounded-lg text-xs font-serif text-white focus:outline-none"
                        rows={2}
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingLineId(null)}
                          className="px-2.5 py-1 text-[11px] text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(line.id)}
                          className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg text-[11px]"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="font-serif text-sm text-slate-100 leading-relaxed pl-3 border-l-2 border-amber-500/80">
                      &quot;{line.adaptedText}&quot;
                    </div>
                  )}

                  {/* Phonetic Pronunciation Guide */}
                  {scriptMode !== 'romanized' && (
                    <div className="text-[11px] font-mono text-slate-400 bg-slate-900/60 p-2 rounded-lg">
                      <strong className="text-slate-500">Phonetic:</strong> {line.phoneticTransliteration}
                    </div>
                  )}

                  {/* Cultural Commentary Card */}
                  <div className="p-3 bg-amber-950/20 border border-amber-500/20 rounded-lg text-xs space-y-1">
                    <div className="font-semibold text-amber-300 flex items-center space-x-1.5 text-[11px]">
                      <MessageSquare className="w-3 h-3 text-amber-400" />
                      <span>Cultural Decision Rationale</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {line.culturalRationale}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
