'use client';

import React, { useState, useEffect } from 'react';
import { ScreenplayProject, ScriptDialogueLine } from '@/types';
import { getCulturalProfile } from '@/data/culturalProfiles';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sparkles,
  Sliders,
  CheckCircle2,
  Activity,
  Layers,
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
  const [speechSynthesisSupported, setSpeechSynthesisSupported] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && !('speechSynthesis' in window)) {
      setSpeechSynthesisSupported(false);
    }
  }, []);

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
      // Mock playback simulation
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 2500);
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
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl animate-fadeIn">
      {/* Stage Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              AUDIO CADENCE & DIALECT AUDITION
            </span>
            <span className="text-xs text-slate-400 font-mono">Web Speech Studio</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Regional Dialect Audition Stage</h2>
          <p className="text-xs text-slate-300">
            Preview cadence, regional tone markers, and phonetic rhythm before production voice recording.
          </p>
        </div>

        {/* Live Cadence Badge */}
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-amber-400">
          <Activity className={`w-3.5 h-3.5 ${isPlaying ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
          <span>Pitch: {pitch.toFixed(2)}x</span>
          <span>•</span>
          <span>Tempo: {rate.toFixed(2)}x</span>
        </div>
      </div>

      {/* Cadence Specs Bar */}
      <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div>
          <span className="text-slate-400 font-semibold block mb-0.5">Cadence Profile:</span>
          <span className="text-slate-200">{profile.audioCadence.speechRhythm}</span>
        </div>
        <div>
          <span className="text-slate-400 font-semibold block mb-0.5">Modulation Pattern:</span>
          <span className="text-slate-200">{profile.audioCadence.pitchModulation}</span>
        </div>
        <div>
          <span className="text-slate-400 font-semibold block mb-0.5">Key Phonetic Markers:</span>
          <div className="flex flex-wrap gap-1 mt-0.5">
            {profile.audioCadence.phoneticMarkers.map((m, i) => (
              <span key={i} className="text-[10px] bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Active Audio Player Visualizer Box */}
      <div className="p-6 bg-gradient-to-r from-slate-950 via-amber-950/20 to-slate-950 border border-amber-500/30 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Radio className={`w-4 h-4 ${isPlaying ? 'text-rose-500 animate-ping' : 'text-amber-400'}`} />
            <span className="text-xs font-mono font-bold text-amber-300 uppercase">
              Now Auditioning: {selectedLine.characterName}
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
            Tone: {selectedLine.toneMarker}
          </span>
        </div>

        {/* Spoken Text Quote */}
        <div className="font-serif text-lg text-white font-medium pl-4 border-l-2 border-amber-400">
          &quot;{selectedLine.adaptedText}&quot;
        </div>
        <div className="text-xs font-mono text-slate-400 pl-4">
          Phonetic Track: &quot;{selectedLine.phoneticTransliteration}&quot;
        </div>

        {/* Animated Waveform Visualizer */}
        <div className="h-10 flex items-center justify-center space-x-1 py-2">
          {Array.from({ length: 32 }).map((_, i) => (
            <div
              key={i}
              className={`w-1.5 rounded-full transition-all duration-150 ${
                isPlaying
                  ? 'bg-gradient-to-t from-amber-500 to-orange-400'
                  : 'bg-slate-800 h-2'
              }`}
              style={{
                height: isPlaying ? `${Math.max(6, Math.sin(i * 0.4) * 28 + Math.random() * 12)}px` : '4px',
              }}
            />
          ))}
        </div>

        {/* Player Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center space-x-3">
            {isPlaying ? (
              <button
                onClick={handleStopVoice}
                className="px-5 py-2.5 bg-rose-500 hover:bg-rose-400 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg shadow-rose-500/20 transition-all"
              >
                <Pause className="w-4 h-4" />
                <span>Stop Playback</span>
              </button>
            ) : (
              <button
                onClick={() => handlePlayVoice(selectedLine)}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg shadow-amber-500/20 transition-all"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Audition Voice Line</span>
              </button>
            )}
          </div>

          {/* Sliders for Pitch and Rate */}
          <div className="flex items-center space-x-4 text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <span>Pitch:</span>
              <input
                type="range"
                min="0.7"
                max="1.4"
                step="0.05"
                value={pitch}
                onChange={e => setPitch(Number(e.target.value))}
                className="w-20 accent-amber-500"
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
                className="w-20 accent-amber-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dialogue Line Selector Grid */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Select Line to Audition from {currentScene.heading.split('-')[0]}:
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentScene.adaptedScreenplayLines.map(line => {
            const isSelected = selectedLine.id === line.id;
            return (
              <button
                key={line.id}
                onClick={() => handlePlayVoice(line)}
                className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/50 shadow-md shadow-amber-500/5'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-950'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-amber-400 font-mono">{line.characterName}</span>
                  <span className="text-[10px] text-slate-400 font-medium px-2 py-0.5 bg-slate-900 rounded">
                    {line.toneMarker}
                  </span>
                </div>
                <div className="font-serif text-xs text-slate-200 line-clamp-2">
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
