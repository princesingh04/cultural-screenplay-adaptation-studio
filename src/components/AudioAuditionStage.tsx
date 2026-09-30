'use client';

import React, { useState, useEffect } from 'react';
import { ScreenplayProject, ScriptDialogueLine } from '@/types';
import { getCulturalProfile } from '@/data/culturalProfiles';
import {
  Play,
  Pause,
  Activity,
  Radio,
} from 'lucide-react';

interface AudioAuditionStageProps {
  project: ScreenplayProject;
  activeLine?: ScriptDialogueLine | null;
}

export const AudioAuditionStage: React.FC<AudioAuditionStageProps> = ({
  project,
  activeLine: initialActiveLine,
}) => {
  const profile = getCulturalProfile(project.selectedCultureId);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number>(0);
  const [selectedLine, setSelectedLine] = useState<ScriptDialogueLine>(
    initialActiveLine || project.scenes[0].adaptedScreenplayLines[0]
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [pitch, setPitch] = useState<number>(profile.audioCadence.vocalPitch);
  const [rate, setRate] = useState<number>(profile.audioCadence.speechRate);

  const handlePlayVoice = (line: ScriptDialogueLine) => {
    setSelectedLine(line);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(line.phoneticTransliteration || line.adaptedText);
      utterance.pitch = pitch;
      utterance.rate = rate;

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 2000);
    }
  };

  const handleStopVoice = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  const currentScene = project.scenes[selectedSceneIndex] || project.scenes[0];

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div>
          <h2 className="text-base font-semibold text-zinc-100">Regional Dialect Audition</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Test regional cadence, phonetics, and vocal pacing for actor rehearsals.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
          <Activity className={`w-3.5 h-3.5 ${isPlaying ? 'text-zinc-100 animate-pulse' : 'text-zinc-600'}`} />
          <span>Pitch: {pitch.toFixed(2)}x</span>
          <span>•</span>
          <span>Tempo: {rate.toFixed(2)}x</span>
        </div>
      </div>

      {/* Cadence Parameters */}
      <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 text-xs grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <span className="text-zinc-500 font-mono text-[11px] block">Rhythm:</span>
          <span className="text-zinc-300 text-[11px]">{profile.audioCadence.speechRhythm}</span>
        </div>
        <div>
          <span className="text-zinc-500 font-mono text-[11px] block">Modulation:</span>
          <span className="text-zinc-300 text-[11px]">{profile.audioCadence.pitchModulation}</span>
        </div>
        <div>
          <span className="text-zinc-500 font-mono text-[11px] block">Phonetic Markers:</span>
          <div className="flex flex-wrap gap-1 mt-0.5">
            {profile.audioCadence.phoneticMarkers.map((m, i) => (
              <span key={i} className="text-[10px] font-mono px-1.5 py-0.5 bg-zinc-900 text-zinc-400 rounded">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Player Display */}
      <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-xl space-y-4">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2">
            <Radio className={`w-3.5 h-3.5 ${isPlaying ? 'text-emerald-400 animate-pulse' : 'text-zinc-600'}`} />
            <span className="font-semibold text-zinc-300">{selectedLine.characterName}</span>
          </div>
          <span className="text-zinc-500">{selectedLine.toneMarker}</span>
        </div>

        <div className="font-serif text-base text-zinc-100 pl-3 border-l-2 border-zinc-700">
          &quot;{selectedLine.adaptedText}&quot;
        </div>
        <div className="text-[11px] font-mono text-zinc-500 pl-3">
          Phonetic: &quot;{selectedLine.phoneticTransliteration}&quot;
        </div>

        {/* Minimalist Waveform */}
        <div className="h-6 flex items-center justify-center space-x-1 py-1">
          {Array.from({ length: 28 }).map((_, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-150 ${
                isPlaying ? 'bg-zinc-300' : 'bg-zinc-800 h-1.5'
              }`}
              style={{
                height: isPlaying ? `${Math.max(4, Math.sin(i * 0.5) * 20 + Math.random() * 8)}px` : '3px',
              }}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1 text-xs">
          <div>
            {isPlaying ? (
              <button
                onClick={handleStopVoice}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg font-medium flex items-center space-x-1.5 transition-colors"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                onClick={() => handlePlayVoice(selectedLine)}
                className="px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-950 rounded-lg font-semibold flex items-center space-x-1.5 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-zinc-950" />
                <span>Play Audition</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-4 text-zinc-400 font-mono text-[11px]">
            <div className="flex items-center space-x-2">
              <span>Pitch:</span>
              <input
                type="range"
                min="0.7"
                max="1.4"
                step="0.05"
                value={pitch}
                onChange={e => setPitch(Number(e.target.value))}
                className="w-16 accent-zinc-400"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span>Tempo:</span>
              <input
                type="range"
                min="0.7"
                max="1.3"
                step="0.05"
                value={rate}
                onChange={e => setRate(Number(e.target.value))}
                className="w-16 accent-zinc-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Line Selector */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono text-zinc-500 uppercase block">Select Line to Audition:</span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {currentScene.adaptedScreenplayLines.map(line => {
            const isSelected = selectedLine.id === line.id;
            return (
              <button
                key={line.id}
                onClick={() => handlePlayVoice(line)}
                className={`text-left p-3 rounded-lg border transition-colors flex flex-col justify-between space-y-1.5 ${
                  isSelected
                    ? 'bg-zinc-800 border-zinc-600 text-zinc-100'
                    : 'bg-zinc-950 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="font-semibold text-zinc-300">{line.characterName}</span>
                  <span className="text-zinc-500">{line.toneMarker}</span>
                </div>
                <div className="font-serif text-xs text-zinc-200 line-clamp-1">
                  &quot;{line.adaptedText}&quot;
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
