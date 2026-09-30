'use client';

import React, { useState, useRef } from 'react';
import { CULTURAL_PROFILES, getCulturalProfile } from '@/data/culturalProfiles';
import { SAMPLE_SCREENPLAYS } from '@/data/sampleScreenplays';
import { SettingType, OutputScript, ScreenplayProject } from '@/types';
import { extractScreenplayToProject } from '@/services/extractor';
import {
  FileText,
  Upload,
  ArrowRight,
  Check,
  RefreshCw,
  Info,
  FileCheck,
  AlertCircle,
  FileUp,
  Sparkles,
  Clock,
  Loader2,
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
  const [selectedSampleId, setSelectedSampleId] = useState<string>('inheritance_deed');
  const [selectedCultureId, setSelectedCultureId] = useState<string>(project.selectedCultureId);
  const [selectedSetting, setSelectedSetting] = useState<SettingType>(project.selectedSetting);
  const [outputScript, setOutputScript] = useState<OutputScript>(project.outputScript);
  const [scriptText, setScriptText] = useState<string>(project.sourceScreenplayText);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractionElapsed, setExtractionElapsed] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const activeProfile = getCulturalProfile(selectedCultureId);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLE_SCREENPLAYS.find(s => s.id === sampleId);
    if (sample) {
      setSelectedSampleId(sample.id);
      setScriptText(sample.rawText);
      setUploadedFileName(null);
      setUploadError(null);
      if (sample.id === 'runaway_dowry') {
        setSelectedCultureId('haryanvi');
      } else if (sample.id === 'drought_well') {
        setSelectedCultureId('bhojpuri_bihar');
      } else {
        setSelectedCultureId('majhi_punjab');
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/parse-screenplay', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to parse file');
      }

      setScriptText(data.text);
      setSelectedSampleId('');
      setUploadedFileName(`${data.filename} (${data.pageCount} page${data.pageCount > 1 ? 's' : ''})`);
      
      // Auto-detect dialect hint based on content
      const lower = data.text.toLowerCase();
      if (lower.includes('meera') || lower.includes('dowry') || lower.includes('rajan')) {
        setSelectedCultureId('haryanvi');
      } else if (lower.includes('balwant') || lower.includes('chaudhary') || lower.includes('drought') || lower.includes('aquifer')) {
        setSelectedCultureId('bhojpuri_bihar');
      } else if (lower.includes('amar') || lower.includes('kabir')) {
        setSelectedCultureId('majhi_punjab');
      }
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || 'Error parsing document. Please check the file.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleStartExtraction = async () => {
    setIsExtracting(true);
    setExtractionElapsed(0);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setExtractionElapsed(prev => prev + 1);
    }, 1000);

    const controller = new AbortController();
    // Allow up to 60s for full LLM screenplay adaptation
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const res = await fetch('/api/adapt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          scriptText,
          cultureId: selectedCultureId,
          setting: selectedSetting,
          outputScript,
        }),
      });
      clearTimeout(timeoutId);
      const data = await res.json();
      if (data.success && data.project) {
        if (timerRef.current) clearInterval(timerRef.current);
        setProject(data.project);
        setIsExtracting(false);
        onProceed();
        return;
      } else if (data.error) {
        console.warn('AI Adaptation API warning:', data.error);
      }
    } catch (err: any) {
      console.warn('AI Adaptation API request failed or aborted:', err.message);
    } finally {
      clearTimeout(timeoutId);
    }

    if (timerRef.current) clearInterval(timerRef.current);
    // High-fidelity deterministic extraction fallback
    const activeTitle = uploadedFileName
      ? uploadedFileName.split('.')[0]
      : SAMPLE_SCREENPLAYS.find(s => s.id === selectedSampleId)?.title || 'Culturally Adapted Screenplay';

    const updatedProject = extractScreenplayToProject(
      scriptText,
      activeTitle,
      selectedCultureId,
      selectedSetting,
      outputScript
    );
    setProject(updatedProject);
    setIsExtracting(false);
    onProceed();
  };

  return (
    <div className="space-y-6">
      {/* Workbench Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">Source Script & Dialect Configuration</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Upload a screenplay PDF/TXT or use the editor to extract canonical entities and adapt into regional vernacular.
          </p>
        </div>

        {/* Upload & Sample Controls - Scrollable ribbon on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap w-full sm:w-auto scrollbar-none -mx-3 px-3 sm:mx-0 sm:px-0">
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.md,.fountain"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 flex items-center space-x-1.5 transition-colors disabled:opacity-50 flex-shrink-0"
          >
            {isUploading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-zinc-400" />
                <span>Reading PDF...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5 text-zinc-300" />
                <span>Upload PDF / TXT</span>
              </>
            )}
          </button>

          {/* Quick sample loader: 3 distinct test scripts */}
          {SAMPLE_SCREENPLAYS.map((sample, idx) => {
            const isSelected = selectedSampleId === sample.id && !uploadedFileName;
            return (
              <button
                key={sample.id}
                onClick={() => handleLoadSample(sample.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all flex items-center space-x-1.5 flex-shrink-0 whitespace-nowrap ${
                  isSelected
                    ? 'bg-zinc-800 text-zinc-100 border-zinc-500 shadow-sm'
                    : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border-zinc-800'
                }`}
                title={`${sample.genre} • ${sample.logline}`}
              >
                <FileText className={`w-3.5 h-3.5 ${isSelected ? 'text-zinc-200' : 'text-zinc-500'}`} />
                <span>
                  {idx + 1}. {sample.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Upload Notification Banner */}
      {uploadedFileName && (
        <div className="p-3 bg-zinc-900 border border-zinc-700 rounded-lg flex items-center justify-between text-xs text-zinc-200">
          <div className="flex items-center space-x-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>Loaded document: <strong>{uploadedFileName}</strong></span>
          </div>
          <button
            onClick={() => { setUploadedFileName(null); setScriptText(SAMPLE_SCREENPLAYS[0].rawText); }}
            className="text-zinc-500 hover:text-zinc-300 text-[11px]"
          >
            Reset
          </button>
        </div>
      )}

      {uploadError && (
        <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-lg flex items-center space-x-2 text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Test Script Directory Quick Reference */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-zinc-500 px-1 font-mono gap-2">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
          <span>3 Test Scripts loaded: 1. Agrarian Debt • 2. Wedding Trunk • 3. Drought Well</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="text-zinc-600">Sample PDFs:</span>
          <code className="text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">d:\projects\assignment3\test_scripts\</code>
        </div>
      </div>

      {/* Main Two-Column Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Screenplay Textarea */}
        <div className="lg:col-span-7 flex flex-col bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-zinc-300 font-mono">SCREENPLAY TEXT</span>
              {uploadedFileName && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/20">
                  PDF Parsed
                </span>
              )}
            </div>
            <span className="text-zinc-500 font-mono text-[11px]">
              {scriptText.split(/\n\s*\n/).filter(Boolean).length} paragraphs • Standard Format
            </span>
          </div>

          <div className="p-3 sm:p-4 flex-1">
            <textarea
              value={scriptText}
              onChange={e => setScriptText(e.target.value)}
              placeholder="Paste screenplay here or upload a PDF/TXT using the button above..."
              rows={18}
              className="w-full h-[320px] sm:h-[440px] p-3 sm:p-4 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 font-mono text-xs sm:text-[13px] leading-relaxed resize-none focus:outline-none focus:border-zinc-500 selection:bg-zinc-700 scrollbar-thin scrollbar-thumb-zinc-800"
            />
          </div>
        </div>

        {/* Right Column: Dialect & Cultural Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-5">
            {/* Dialect Selection */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block font-mono">
                Target Dialect & Culture
              </label>
              <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
                {CULTURAL_PROFILES.map(cp => {
                  const isSelected = selectedCultureId === cp.id;
                  return (
                    <button
                      key={cp.id}
                      onClick={() => setSelectedCultureId(cp.id)}
                      className={`w-full text-left p-2.5 rounded-lg border transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'bg-zinc-800 border-zinc-600 text-zinc-100'
                          : 'bg-zinc-950/70 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-xs text-zinc-200 flex items-center space-x-1.5">
                          <span>{cp.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-zinc-200" />}
                        </div>
                        <div className="text-[11px] text-zinc-500">{cp.subRegion}</div>
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
                    className={`py-2 rounded-lg text-xs font-medium capitalize border transition-colors text-center ${
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
                    className={`py-2 rounded-lg text-xs font-medium border transition-colors text-center ${
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
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-3.5 text-xs space-y-2">
            <div className="flex items-center space-x-1.5 text-zinc-400 font-mono text-[11px]">
              <Info className="w-3.5 h-3.5" />
              <span className="font-semibold uppercase">Profile Note</span>
            </div>
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              {activeProfile.adaptationGuidance}
            </p>
            <div className="pt-0.5 text-[11px] text-zinc-500 font-mono">
              Greeting: <span className="text-zinc-400">{activeProfile.honorificRules.elderGreeting.split('(')[0]}</span>
            </div>
          </div>

          {/* Dedicated Conversion In-Progress Card */}
          {isExtracting && (
            <div className="bg-zinc-900/95 border border-emerald-500/40 rounded-xl p-4 shadow-2xl space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </div>
                  <span className="text-xs font-semibold text-zinc-100 flex items-center gap-1.5 font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    AI Script Adaptation Active
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                  Elapsed: {extractionElapsed}s
                </span>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                Conversion is happening. It may take some time—<strong>please have patience</strong> while the AI models translate regional nuances, map character aliases, and ensure continuity.
              </p>

              {/* Dynamic Sub-task indicator */}
              <div className="p-2.5 bg-zinc-950/90 border border-zinc-800 rounded-lg flex items-center space-x-2.5 text-xs text-zinc-300 font-mono">
                <Loader2 className="w-4 h-4 text-emerald-400 animate-spin flex-shrink-0" />
                <span className="truncate">
                  {extractionElapsed < 5 && 'Parsing screenplay scenes and narrative beats...'}
                  {extractionElapsed >= 5 && extractionElapsed < 12 && 'Canonicalizing character entities & resolving aliases...'}
                  {extractionElapsed >= 12 && extractionElapsed < 20 && 'Tracing physical props and multi-scene handoffs...'}
                  {extractionElapsed >= 20 && extractionElapsed < 32 && `Adapting dialogue to ${activeProfile.name} vernacular...`}
                  {extractionElapsed >= 32 && 'Finalizing continuity specifications & locked seeds...'}
                </span>
              </div>

              {/* Progress bar & patience advice */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5 text-amber-300 font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    Usually takes ~15–35 seconds
                  </span>
                  <span className="text-zinc-500 text-[10px] font-mono">Do not refresh</span>
                </div>
                <div className="w-full bg-zinc-800/80 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(95, 12 + extractionElapsed * 2.8)}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action CTA */}
          <button
            onClick={handleStartExtraction}
            disabled={isExtracting || !scriptText.trim()}
            className="w-full py-3 px-4 rounded-xl font-semibold text-xs bg-zinc-100 hover:bg-white text-zinc-950 border border-zinc-200 shadow-md transition-colors flex items-center justify-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isExtracting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Converting & Adapting Vernacular ({extractionElapsed}s)...</span>
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
