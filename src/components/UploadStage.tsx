'use client';

import React, { useState } from 'react';
import { CULTURAL_PROFILES, getCulturalProfile } from '@/data/culturalProfiles';
import { SAMPLE_SCREENPLAYS } from '@/data/sampleScreenplays';
import { SettingType, OutputScript, ScreenplayProject } from '@/types';
import { extractScreenplayToProject } from '@/services/extractor';
import {
  FileText,
  MapPin,
  Compass,
  Scroll,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Building,
  Shirt,
  Volume2,
  RefreshCw,
} from 'lucide-react';

interface UploadStageProps {
  project: ScreenplayProject;
  setProject: React.Dispatch<React.SetStateAction<ScreenplayProject>>;
  onProceed: () => void;
}

export const UploadStage: React.FC<UploadStageProps> = ({
  project,
  setProject,
  onProceed,
}) => {
  const [selectedCultureId, setSelectedCultureId] = useState<string>(project.selectedCultureId);
  const [selectedSetting, setSelectedSetting] = useState<SettingType>(project.selectedSetting);
  const [outputScript, setOutputScript] = useState<OutputScript>(project.outputScript);
  const [scriptText, setScriptText] = useState<string>(project.sourceScreenplayText);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);

  const activeProfile = getCulturalProfile(selectedCultureId);

  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLE_SCREENPLAYS.find(s => s.id === sampleId);
    if (sample) {
      setScriptText(sample.rawText);
    }
  };

  const handleStartExtraction = () => {
    setIsExtracting(true);
    setTimeout(() => {
      const updatedProject = extractScreenplayToProject(
        scriptText,
        'The Ancestral Deed',
        selectedCultureId,
        selectedSetting,
        outputScript
      );
      setProject(updatedProject);
      setIsExtracting(false);
      onProceed();
    }, 600);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Studio Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 p-8 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Agentic Cultural Transcreation Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Cultural Screenplay & Visual Adaptation Studio
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Recreate screenplays inside an exact Indian dialect, kinship structure, and vernacular visual world.
            Maintains strict canonical identity, cross-scene prop continuity, and outputs a complete production bible.
          </p>
        </div>

        {/* Quick Sample Selector */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Load:</span>
          {SAMPLE_SCREENPLAYS.map(sample => (
            <button
              key={sample.id}
              onClick={() => handleLoadSample(sample.id)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-amber-600/20 text-slate-200 hover:text-amber-300 border border-slate-700 hover:border-amber-500/50 transition-all flex items-center space-x-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>{sample.title} ({sample.scenesCount} Scenes)</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Screenplay Input Editor */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 flex flex-col h-full shadow-lg">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-semibold text-white">Source Screenplay (Neutral)</h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {scriptText.split(/\n\s*\n/).filter(Boolean).length} paragraphs • Standard format
              </span>
            </div>

            <div className="mt-4 flex-1">
              <textarea
                value={scriptText}
                onChange={e => setScriptText(e.target.value)}
                placeholder="Paste or write standard screenplay scenes here..."
                rows={18}
                className="w-full h-[460px] p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200 font-mono text-xs sm:text-sm leading-relaxed resize-none focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 selection:bg-amber-500/30 scrollbar-thin scrollbar-thumb-slate-800"
              />
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Supports standard screenplay formatting (Scene Headings, Dialogue, Action)</span>
              <span className="text-amber-400 font-medium">Includes sample characters & props</span>
            </div>
          </div>
        </div>

        {/* Right Column: Cultural Dialect & Setting Settings */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-lg space-y-6">
            <div className="flex items-center space-x-2 pb-4 border-b border-slate-800">
              <Compass className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-semibold text-white">Target Cultural & Dialect Setting</h2>
            </div>

            {/* Dialect Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Exact Culture / Dialect</span>
                <span className="text-amber-400 font-normal">Precision Required</span>
              </label>
              <div className="grid grid-cols-1 gap-2">
                {CULTURAL_PROFILES.map(cp => {
                  const isSelected = selectedCultureId === cp.id;
                  return (
                    <button
                      key={cp.id}
                      onClick={() => setSelectedCultureId(cp.id)}
                      className={`text-left p-3 rounded-xl border transition-all flex items-start justify-between ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500/60 text-white shadow-md shadow-amber-500/5'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-sm flex items-center space-x-2">
                          <span>{cp.name}</span>
                          {isSelected && <CheckCircle className="w-4 h-4 text-amber-400" />}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">{cp.subRegion}</div>
                      </div>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800/80 text-amber-300 border border-slate-700">
                        {cp.dialect}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Setting: Rural vs Urban */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Geographic Milieu & Setting</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['rural', 'semi-urban', 'urban'] as SettingType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedSetting(type)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium capitalize border transition-all text-center ${
                      selectedSetting === type
                        ? 'bg-amber-500/15 border-amber-500/60 text-amber-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-950'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Script Format */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Scroll className="w-3.5 h-3.5 text-amber-400" />
                <span>Screenplay Writing Script</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'romanized', label: 'Romanized (Phonetic)' },
                  { id: 'gurmukhi', label: 'Gurmukhi (Regional)' },
                  { id: 'devanagari', label: 'Devanagari (Script)' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setOutputScript(opt.id as OutputScript)}
                    className={`py-2 px-2 rounded-xl text-xs font-medium border transition-all text-center truncate ${
                      outputScript === opt.id
                        ? 'bg-amber-500/15 border-amber-500/60 text-amber-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-950'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cultural Profile Highlights Card */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-5 space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Building className="w-4 h-4" />
              <span>Cultural DNA: {activeProfile.name}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
                <div className="text-slate-400 font-semibold mb-1 flex items-center space-x-1">
                  <Shirt className="w-3 h-3 text-amber-400" />
                  <span>Attire & Textiles</span>
                </div>
                <div className="text-slate-200">{activeProfile.visualAesthetics.traditionalFabrics.slice(0, 2).join(', ')}</div>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
                <div className="text-slate-400 font-semibold mb-1 flex items-center space-x-1">
                  <Volume2 className="w-3 h-3 text-amber-400" />
                  <span>Kinship & Greeting</span>
                </div>
                <div className="text-slate-200 truncate">{activeProfile.honorificRules.elderGreeting.split('(')[0]}</div>
              </div>
            </div>

            <p className="text-xs text-slate-400 italic">
              &quot;{activeProfile.adaptationGuidance}&quot;
            </p>
          </div>

          {/* Action Button: Extract & Normalize */}
          <button
            onClick={handleStartExtraction}
            disabled={isExtracting || !scriptText.trim()}
            className="w-full py-4 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:via-orange-400 hover:to-rose-500 text-slate-950 shadow-xl shadow-amber-500/20 flex items-center justify-center space-x-2 transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExtracting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Normalizing Canonical Entities & Scenes...</span>
              </>
            ) : (
              <>
                <span>Extract Scenes & Canonical Entities</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
