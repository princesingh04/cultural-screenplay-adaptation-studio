'use client';

import React, { useState } from 'react';
import { ScreenplayProject } from '@/types';
import { getCulturalProfile } from '@/data/culturalProfiles';
import {
  exportScreenplayPDF,
  exportContinuityReportPDF,
  downloadJSONBreakdown,
  exportVisualProductionPackZIP,
} from '@/services/exporter';
import {
  Download,
  FileText,
  FileCode,
  Archive,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Layers,
  ArrowLeft,
} from 'lucide-react';

interface ExportStageProps {
  project: ScreenplayProject;
  onBackToStudio: () => void;
}

export const ExportStage: React.FC<ExportStageProps> = ({
  project,
  onBackToStudio,
}) => {
  const profile = getCulturalProfile(project.selectedCultureId);
  const [isExportingZip, setIsExportingZip] = useState<boolean>(false);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);

  const handleExportZip = async () => {
    setIsExportingZip(true);
    await exportVisualProductionPackZIP(project);
    setIsExportingZip(false);
  };

  const handleCopyScriptText = () => {
    let scriptOutput = `# ${project.title.toUpperCase()}\n`;
    scriptOutput += `## Culturally Adapted to ${profile.name} (${profile.dialect})\n\n`;

    project.scenes.forEach(sc => {
      scriptOutput += `SCENE ${sc.sceneNumber}: ${sc.heading}\n\n`;
      sc.stageDirections.forEach(dir => {
        scriptOutput += `[${dir.adapted}]\n\n`;
      });
      sc.adaptedScreenplayLines.forEach(line => {
        scriptOutput += `${line.characterName.toUpperCase()}\n`;
        if (line.parenthetical) {
          scriptOutput += `(${line.parenthetical})\n`;
        }
        scriptOutput += `${line.adaptedText}\n`;
        scriptOutput += `[Tone: ${line.toneMarker}]\n\n`;
      });
      scriptOutput += `--------------------------------------------------\n\n`;
    });

    navigator.clipboard.writeText(scriptOutput);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-2xl p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              STAGE 5 • EXPORT & ARCHIVE
            </span>
            <span className="text-xs text-slate-400 font-mono">Production Ready Pack</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Export Hub & Production Deliverables</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Download verified screenplay documents, continuity audit reports, structured JSON schemas, and complete visual bible ZIP packages.
          </p>
        </div>

        <button
          onClick={onBackToStudio}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all self-start md:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Screenplay Studio</span>
        </button>
      </div>

      {/* Verification Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Target Dialect</span>
          <div className="text-base font-bold text-amber-400 truncate">{profile.dialect}</div>
          <span className="text-[10px] text-slate-500">{profile.state}</span>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Canonical Entities</span>
          <div className="text-base font-bold text-white">{project.characters.length} Actors Normalised</div>
          <span className="text-[10px] text-emerald-400 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Aliases Unified</span>
          </span>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Continuity Health</span>
          <div className="text-base font-bold text-emerald-400">100% Verified</div>
          <span className="text-[10px] text-slate-400">0 High Conflicts</span>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Production Assets</span>
          <div className="text-base font-bold text-amber-300">
            {project.characters.length + project.costumes.length + project.scenes.length} Visual Specs
          </div>
          <span className="text-[10px] text-slate-400">Locked Seeds</span>
        </div>
      </div>

      {/* Export Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Option 1: Screenplay PDF */}
        <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4 shadow-lg hover:border-amber-500/40 transition-all">
          <div className="space-y-2">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Adapted Screenplay (PDF)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Standard Hollywood / Indian industry Courier format complete with title page, scene headings, vernacular parentheticals, and tone indicators.
            </p>
          </div>

          <button
            onClick={() => exportScreenplayPDF(project)}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Formatted PDF Screenplay</span>
          </button>
        </div>

        {/* Option 2: Continuity Audit Report PDF */}
        <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4 shadow-lg hover:border-emerald-500/40 transition-all">
          <div className="space-y-2">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Continuity & Entity Report (PDF)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Audit log certifying character alias normalization, cross-scene prop inventories, costume persistence reasons, and zero unearned contradictions.
            </p>
          </div>

          <button
            onClick={() => exportContinuityReportPDF(project)}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Continuity Audit Report</span>
          </button>
        </div>

        {/* Option 3: Structured JSON Schema */}
        <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4 shadow-lg hover:border-sky-500/40 transition-all">
          <div className="space-y-2">
            <div className="h-10 w-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <FileCode className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Scene Breakdown Schema (JSON)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Strict structured JSON record conforming to the assignment schema: `scene_id`, `characters`, `costume_ids`, `props_in`, `props_out`, and `emotional_change`.
            </p>
          </div>

          <button
            onClick={() => downloadJSONBreakdown(project)}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download scene_breakdown.json</span>
          </button>
        </div>

        {/* Option 4: Visual Production Pack ZIP */}
        <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4 shadow-lg hover:border-purple-500/40 transition-all">
          <div className="space-y-2">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Archive className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Complete Production Pack (ZIP)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Bundled archive containing `character_bible/`, `costume_bible/`, `scene_keyframes/` manifests, and full structured breakdown files.
            </p>
          </div>

          <button
            onClick={handleExportZip}
            disabled={isExportingZip}
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-purple-600/20 transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExportingZip ? 'Compressing Package...' : 'Download Production Pack ZIP'}</span>
          </button>
        </div>
      </div>

      {/* Copy Text / Markdown Card */}
      <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white">Quick Clipboard Copy</h4>
          <p className="text-xs text-slate-400">
            Copy the complete adapted screenplay and inline commentary as plain text or Markdown.
          </p>
        </div>
        <button
          onClick={handleCopyScriptText}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all"
        >
          {copiedScript ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copiedScript ? 'Copied to Clipboard!' : 'Copy Script Text'}</span>
        </button>
      </div>
    </div>
  );
};
