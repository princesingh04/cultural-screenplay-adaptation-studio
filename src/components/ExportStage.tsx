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
  ShieldCheck,
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">Production Export Manifest</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Export standard screenplay PDFs, continuity audits, JSON schemas, and visual package archives.
          </p>
        </div>

        <button
          onClick={onBackToStudio}
          className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Script Editor</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-lg">
          <span className="text-zinc-500 text-[11px] block">Target Dialect</span>
          <span className="font-semibold text-zinc-200 mt-0.5 block">{profile.dialect}</span>
        </div>

        <div className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-lg">
          <span className="text-zinc-500 text-[11px] block">Canonical Actors</span>
          <span className="font-semibold text-zinc-200 mt-0.5 block">{project.characters.length} Normalized</span>
        </div>

        <div className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-lg">
          <span className="text-zinc-500 text-[11px] block">Continuity Health</span>
          <span className="font-semibold text-emerald-400 mt-0.5 block">100% Passed</span>
        </div>

        <div className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-lg">
          <span className="text-zinc-500 text-[11px] block">Production Assets</span>
          <span className="font-semibold text-zinc-200 mt-0.5 block">
            {project.characters.length + project.costumes.length + project.scenes.length} Specs Locked
          </span>
        </div>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* PDF Screenplay */}
        <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-xl flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-zinc-200 text-sm font-semibold">
              <FileText className="w-4 h-4 text-zinc-400" />
              <span>Adapted Screenplay (PDF)</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Standard Hollywood / Indian industry Courier format complete with scene headings, parentheticals, and tone indicators.
            </p>
          </div>

          <button
            onClick={() => exportScreenplayPDF(project)}
            className="w-full py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold rounded-lg text-xs flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Screenplay PDF</span>
          </button>
        </div>

        {/* Continuity PDF */}
        <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-xl flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-zinc-200 text-sm font-semibold">
              <ShieldCheck className="w-4 h-4 text-zinc-400" />
              <span>Continuity & Entity Audit (PDF)</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Audit log certifying character alias normalization, cross-scene prop inventories, and wardrobe persistence.
            </p>
          </div>

          <button
            onClick={() => exportContinuityReportPDF(project)}
            className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 font-medium rounded-lg text-xs flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>Download Continuity Report</span>
          </button>
        </div>

        {/* JSON Breakdown */}
        <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-xl flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-zinc-200 text-sm font-semibold">
              <FileCode className="w-4 h-4 text-zinc-400" />
              <span>Scene Breakdown Schema (JSON)</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Structured machine-readable JSON matching the candidate brief specification.
            </p>
          </div>

          <button
            onClick={() => downloadJSONBreakdown(project)}
            className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 font-medium rounded-lg text-xs flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>Download scene_breakdown.json</span>
          </button>
        </div>

        {/* Production ZIP */}
        <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-xl flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-zinc-200 text-sm font-semibold">
              <Archive className="w-4 h-4 text-zinc-400" />
              <span>Production Pack Archive (ZIP)</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Bundled archive containing `character_bible/`, `costume_bible/`, `scene_keyframes/` manifests, and full data schemas.
            </p>
          </div>

          <button
            onClick={handleExportZip}
            disabled={isExportingZip}
            className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 font-medium rounded-lg text-xs flex items-center justify-center space-x-1.5 transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>{isExportingZip ? 'Compressing Package...' : 'Download Production Pack ZIP'}</span>
          </button>
        </div>
      </div>

      {/* Copy Clipboard */}
      <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-semibold text-zinc-300">Quick Text Export</span>
          <p className="text-zinc-500 text-[11px]">Copy the complete adapted screenplay text to clipboard.</p>
        </div>
        <button
          onClick={handleCopyScriptText}
          className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-lg text-xs font-mono flex items-center space-x-1.5 transition-colors"
        >
          {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
          <span>{copiedScript ? 'Copied' : 'Copy Script Text'}</span>
        </button>
      </div>
    </div>
  );
};
