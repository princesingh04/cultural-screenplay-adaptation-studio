'use client';

import React, { useState } from 'react';
import { ScreenplayProject, ExtractedScene, ScriptDialogueLine } from '@/types';
import { getCulturalProfile } from '@/data/culturalProfiles';
import { adaptScreenplayLines } from '@/services/adapter';
import {
  Film,
  ArrowRight,
  MessageSquare,
  Check,
  Edit3,
  Languages,
} from 'lucide-react';

interface SideBySideEditorStageProps {
  project: ScreenplayProject;
  setProject: React.Dispatch<React.SetStateAction<ScreenplayProject>>;
  onProceed: () => void;
}

export const SideBySideEditorStage: React.FC<SideBySideEditorStageProps> = ({
  project,
  setProject,
  onProceed,
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
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">Adapted Screenplay Comparison</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Side-by-side comparison of source and culturally adapted scenes with linguistic rationale and tone markers.
          </p>
        </div>

        {/* Script mode & Proceed */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-xs">
            <Languages className="w-3.5 h-3.5 text-zinc-400 ml-1.5 mr-1" />
            {(['romanized', 'gurmukhi', 'devanagari'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => handleScriptModeChange(mode)}
                className={`px-2.5 py-1 rounded text-xs capitalize transition-colors font-mono ${
                  scriptMode === mode
                    ? 'bg-zinc-800 text-zinc-100 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={onProceed}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 hover:bg-white text-zinc-950 flex items-center space-x-1.5 transition-colors"
          >
            <span>Proceed to Visual Gallery</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Scene Navigation Bar */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none font-mono text-xs">
        {project.scenes.map((scene, idx) => (
          <button
            key={scene.sceneId}
            onClick={() => setSelectedSceneIndex(idx)}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
              selectedSceneIndex === idx
                ? 'bg-zinc-800 text-zinc-100 font-semibold border border-zinc-700'
                : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <span className="text-zinc-500">{scene.sceneId}</span>
            <span>Scene {scene.sceneNumber}: {scene.heading.split('-')[0].replace('EXT. ', '').replace('INT. ', '')}</span>
          </button>
        ))}
      </div>

      {/* Split-Screen Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Source Screenplay */}
        <div className="lg:col-span-5 bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800 font-mono text-xs">
            <span className="font-semibold text-zinc-400 uppercase tracking-wider">Source (Neutral)</span>
            <span className="text-zinc-600">English Standard</span>
          </div>

          {/* Heading */}
          <div className="bg-zinc-950 p-3.5 rounded-lg border border-zinc-850 font-mono text-xs space-y-1.5">
            <div className="text-zinc-300 font-bold">{currentScene.heading}</div>
            <div className="text-zinc-500 text-[11px] leading-relaxed">
              {currentScene.stageDirections[0]?.original}
            </div>
          </div>

          {/* Source Dialogue lines */}
          <div className="space-y-3 font-mono text-xs">
            {currentScene.adaptedScreenplayLines.map((line, idx) => (
              <div key={line.id} className="p-3.5 bg-zinc-950/70 border border-zinc-800/80 rounded-lg space-y-1">
                <div className="flex items-center justify-between text-zinc-400 font-semibold text-[11px]">
                  <span>{line.characterName}</span>
                  <span className="text-zinc-600">#{idx + 1}</span>
                </div>
                {line.parenthetical && (
                  <div className="text-zinc-500 italic text-[11px]">({line.parenthetical})</div>
                )}
                <div className="text-zinc-300 pt-0.5 leading-relaxed">
                  &quot;{line.originalText}&quot;
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Adapted Screenplay */}
        <div className="lg:col-span-7 bg-zinc-900/70 border border-zinc-700/80 rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800 font-mono text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="font-semibold text-zinc-200 uppercase tracking-wider">
                Adapted: {profile.name}
              </span>
            </div>
            <span className="text-zinc-400 font-mono text-[11px]">{profile.dialect}</span>
          </div>

          {/* Adapted Stage Directions */}
          <div className="bg-zinc-950 p-3.5 rounded-lg border border-zinc-800 space-y-1.5 text-xs">
            <div className="font-mono text-[11px] text-zinc-400 font-semibold uppercase">
              Mise-en-scène & Cultural Stage Directions
            </div>
            <p className="text-zinc-200 font-serif leading-relaxed">
              {currentScene.stageDirections[0]?.adapted}
            </p>
            <div className="text-[11px] text-zinc-500 font-mono">
              Cultural nuance: {currentScene.stageDirections[0]?.culturalDetails}
            </div>
          </div>

          {/* Adapted Dialogue with Inline Decision Cards */}
          <div className="space-y-4">
            {currentScene.adaptedScreenplayLines.map(line => {
              const isEditing = editingLineId === line.id;
              return (
                <div
                  key={line.id}
                  className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg space-y-2.5 transition-colors hover:border-zinc-700"
                >
                  {/* Speaker and Tone Header */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-zinc-200">{line.characterName}</span>
                      <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800 font-mono text-[10px]">
                        {line.toneMarker}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        if (isEditing) {
                          handleSaveEdit(line.id);
                        } else {
                          setEditingLineId(line.id);
                          setEditText(line.adaptedText);
                        }
                      }}
                      className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
                    >
                      {isEditing ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Edit3 className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Non-verbal gesture */}
                  {line.gestureOrAction && (
                    <div className="text-[11px] text-zinc-400 italic">
                      • Gesture: {line.gestureOrAction}
                    </div>
                  )}

                  {/* Dialogue text */}
                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                        className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded text-xs text-zinc-100 font-mono focus:outline-none"
                        rows={2}
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingLineId(null)}
                          className="px-2.5 py-1 text-[11px] text-zinc-400 hover:text-zinc-200"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(line.id)}
                          className="px-2.5 py-1 bg-zinc-100 text-zinc-950 font-semibold rounded text-[11px]"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="font-serif text-sm text-zinc-100 pl-3 border-l-2 border-zinc-700 leading-relaxed">
                      &quot;{line.adaptedText}&quot;
                    </div>
                  )}

                  {/* Cultural Rationale Note */}
                  <div className="p-2.5 bg-zinc-900/60 rounded border border-zinc-800 text-[11px] space-y-1">
                    <div className="text-zinc-400 font-mono flex items-center space-x-1.5 font-semibold">
                      <MessageSquare className="w-3 h-3 text-zinc-400" />
                      <span>Decision Rationale</span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed">
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
