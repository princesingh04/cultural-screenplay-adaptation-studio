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
  ArrowRight,
  Check,
  RefreshCw,
  Info,
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
    }, 450);
  };

  return (
    <div className="space-y-6">
      {/* Workbench Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">Source Script & Dialect Configuration</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Input a screenplay to extract canonical entities, verify cross-scene continuity, and transcreate into regional vernacular.
          </p>
        </div>

        {/* Quick sample loader */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-zinc-500 font-mono">Sample:</span>
          {SAMPLE_SCREENPLAYS.map(sample => (
            <button
              key={sample.id}
              onClick={() => handleLoadSample(sample.id)}
              className="px-2.5 py-1.5 rounded-md text-xs font-mono bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/80 transition-colors flex items-center space-x-1.5"
            >
              <FileText className="w-3 h-3 text-zinc-400" />
              <span>{sample.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Screenplay Textarea */}
        <div className="lg:col-span-7 flex flex-col bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-300 font-mono">SOURCE SCREENPLAY</span>
            <span className="text-zinc-500 font-mono text-[11px]">
              {scriptText.split(/\n\s*\n/).filter(Boolean).length} paragraphs • Standard Format
            </span>
          </div>

          <div className="p-4 flex-1">
            <textarea
              value={scriptText}
              onChange={e => setScriptText(e.target.value)}
              placeholder="Paste or write screenplay here..."
              rows={22}
              className="w-full h-[520px] p-4 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 font-mono text-xs sm:text-[13px] leading-relaxed resize-none focus:outline-none focus:border-zinc-500 selection:bg-zinc-700 scrollbar-thin scrollbar-thumb-zinc-800"
            />
          </div>
        </div>

        {/* Right Column: Dialect & Cultural Controls */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-5">
            {/* Dialect Selection */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block font-mono">
                Target Dialect & Culture
              </label>
              <div className="space-y-1.5">
                {CULTURAL_PROFILES.map(cp => {
                  const isSelected = selectedCultureId === cp.id;
                  return (
                    <button
                      key={cp.id}
                      onClick={() => setSelectedCultureId(cp.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'bg-zinc-800/90 border-zinc-600 text-zinc-100'
                          : 'bg-zinc-950/70 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-xs text-zinc-200 flex items-center space-x-1.5">
                          <span>{cp.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-zinc-200" />}
                        </div>
                        <div className="text-[11px] text-zinc-500 mt-0.5">{cp.subRegion}</div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                        {cp.dialect}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Geographic Setting */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block font-mono">
                Geographic Setting
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['rural', 'semi-urban', 'urban'] as SettingType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedSetting(type)}
                    className={`py-2 rounded-lg text-xs font-medium capitalize border transition-colors ${
                      selectedSetting === type
                        ? 'bg-zinc-800 border-zinc-600 text-zinc-100 font-semibold'
                        : 'bg-zinc-950/70 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Output Writing Script */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block font-mono">
                Writing Script
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'romanized', label: 'Romanized' },
                  { id: 'gurmukhi', label: 'Gurmukhi' },
                  { id: 'devanagari', label: 'Devanagari' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setOutputScript(opt.id as OutputScript)}
                    className={`py-2 rounded-lg text-xs font-medium border transition-colors ${
                      outputScript === opt.id
                        ? 'bg-zinc-800 border-zinc-600 text-zinc-100 font-semibold'
                        : 'bg-zinc-950/70 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cultural Notes Snippet */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4 text-xs space-y-2.5">
            <div className="flex items-center space-x-1.5 text-zinc-400 font-mono text-[11px]">
              <Info className="w-3.5 h-3.5" />
              <span className="font-semibold uppercase">Profile Note</span>
            </div>
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              {activeProfile.adaptationGuidance}
            </p>
            <div className="pt-1 text-[11px] text-zinc-500 font-mono">
              Greeting: <span className="text-zinc-400">{activeProfile.honorificRules.elderGreeting.split('(')[0]}</span>
            </div>
          </div>

          {/* Action CTA */}
          <button
            onClick={handleStartExtraction}
            disabled={isExtracting || !scriptText.trim()}
            className="w-full py-3.5 px-4 rounded-xl font-semibold text-xs bg-zinc-100 hover:bg-white text-zinc-950 border border-zinc-200 transition-colors flex items-center justify-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isExtracting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Normalizing Canonical Entities...</span>
              </>
            ) : (
              <>
                <span>Extract Scenes & Entities</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
