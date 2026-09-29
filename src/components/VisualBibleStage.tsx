'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ScreenplayProject, CanonicalCharacter, CanonicalCostume, ExtractedScene } from '@/types';
import {
  Image as ImageIcon,
  Users,
  Shirt,
  Layers,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Maximize2,
  Sliders,
  ArrowRight,
  ShieldCheck,
  Eye,
  Camera,
} from 'lucide-react';

interface VisualBibleStageProps {
  project: ScreenplayProject;
  setProject: React.Dispatch<React.SetStateAction<ScreenplayProject>>;
  onProceed: () => void;
}

export const VisualBibleStage: React.FC<VisualBibleStageProps> = ({
  project,
  setProject,
  onProceed,
}) => {
  const [activeTab, setActiveTab] = useState<'characters' | 'costumes' | 'keyframes'>('characters');
  const [selectedAsset, setSelectedAsset] = useState<any>(project.characters[0]);
  const [regenModalOpen, setRegenModalOpen] = useState<boolean>(false);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [customSeed, setCustomSeed] = useState<number>(749201);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  const handleOpenRegenerate = (asset: any) => {
    setSelectedAsset(asset);
    setCustomPrompt(asset.visualSpec?.promptText || asset.keyframeSpec?.promptText || '');
    setCustomSeed(asset.visualSpec?.lockedSeed || asset.keyframeSpec?.lockedSeed || Math.floor(Math.random() * 1000000));
    setRegenModalOpen(true);
  };

  const handleExecuteRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setProject(prev => {
        if (activeTab === 'characters') {
          return {
            ...prev,
            characters: prev.characters.map(c =>
              c.id === selectedAsset.id
                ? {
                    ...c,
                    visualSpec: {
                      ...c.visualSpec,
                      promptText: customPrompt,
                      lockedSeed: customSeed,
                    },
                  }
                : c
            ),
          };
        } else if (activeTab === 'costumes') {
          return {
            ...prev,
            costumes: prev.costumes.map(c =>
              c.id === selectedAsset.id
                ? {
                    ...c,
                    visualSpec: {
                      ...c.visualSpec,
                      promptText: customPrompt,
                      lockedSeed: customSeed,
                    },
                  }
                : c
            ),
          };
        } else {
          return {
            ...prev,
            scenes: prev.scenes.map(s =>
              s.sceneId === selectedAsset.sceneId
                ? {
                    ...s,
                    keyframeSpec: {
                      ...s.keyframeSpec,
                      promptText: customPrompt,
                      lockedSeed: customSeed,
                    },
                  }
                : s
            ),
          };
        }
      });
      setIsRegenerating(false);
      setRegenModalOpen(false);
    }, 800);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Stage Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              STAGE 4 • VISUAL PRODUCTION BIBLE
            </span>
            <span className="text-xs text-slate-400 font-mono">Character & Costume Bibles • Storyboards</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Culturally Anchored Visual Pack</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Consistent face morphology, authentic textile specifications, and 16:9 cinematic storyboard keyframes.
          </p>
        </div>

        <button
          onClick={onProceed}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 flex items-center space-x-2 shadow-md shadow-amber-500/10 transition-all"
        >
          <span>Proceed to Audio Audition & Export</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 space-x-6">
        {[
          { id: 'characters', label: `Character Bible (${project.characters.length})`, icon: Users },
          { id: 'costumes', label: `Costume Bible (${project.costumes.length})`, icon: Shirt },
          { id: 'keyframes', label: `Scene Storyboards (${project.scenes.length})`, icon: Layers },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-2 text-xs font-semibold flex items-center space-x-2 border-b-2 transition-all ${
                isActive
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Character Bible */}
      {activeTab === 'characters' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {project.characters.map(char => (
            <div
              key={char.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col group hover:border-amber-500/40 transition-all"
            >
              {/* Image Preview Container */}
              <div className="relative aspect-[3/4] w-full bg-slate-950 overflow-hidden">
                {char.visualSpec.imageUrl ? (
                  <img
                    src={char.visualSpec.imageUrl}
                    alt={char.canonicalName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}
                {/* Floating Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-amber-300 text-[10px] font-mono font-bold border border-white/10">
                    {char.id}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 backdrop-blur-md text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                    Seed: {char.visualSpec.lockedSeed}
                  </span>
                </div>
              </div>

              {/* Character Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{char.canonicalName}</h3>
                  <div className="text-xs text-amber-400 font-medium">{char.socialRole}</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Original mention: <em>&quot;{char.originalName}&quot;</em> • Age: {char.age}
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div>
                    <strong className="text-slate-400">Facial Traits:</strong> {char.visualSpec.facialFeatures}
                  </div>
                  <div>
                    <strong className="text-slate-400">Grooming & Demeanor:</strong> {char.visualSpec.grooming}
                  </div>
                </div>

                {/* Prompt Spec Box */}
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] space-y-2">
                  <div className="flex items-center justify-between text-slate-400 font-semibold">
                    <span className="flex items-center space-x-1">
                      <Camera className="w-3 h-3 text-amber-400" />
                      <span>Production Prompt Spec</span>
                    </span>
                    <button
                      onClick={() => copyToClipboard(char.visualSpec.promptText)}
                      className="text-slate-400 hover:text-white"
                      title="Copy Prompt"
                    >
                      {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <p className="text-slate-400 line-clamp-2 font-mono text-[10px]">
                    {char.visualSpec.promptText}
                  </p>
                </div>

                {/* Retry / Regenerate Single Asset */}
                <button
                  onClick={() => handleOpenRegenerate(char)}
                  className="w-full py-2 bg-slate-800/80 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-700 hover:border-amber-500/40 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Regenerate Character (Single Asset Retry)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Costume Bible */}
      {activeTab === 'costumes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {project.costumes.map(cost => {
            const char = project.characters.find(c => c.id === cost.characterId);
            return (
              <div
                key={cost.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col group hover:border-amber-500/40 transition-all"
              >
                {/* Costume Visual */}
                <div className="relative aspect-[3/4] w-full bg-slate-950 overflow-hidden">
                  {cost.visualSpec.imageUrl ? (
                    <img
                      src={cost.visualSpec.imageUrl}
                      alt={cost.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <Shirt className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-amber-300 text-[10px] font-mono font-bold border border-white/10">
                      {cost.id}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-slate-300 text-[10px] font-mono border border-slate-700">
                      Scenes: {cost.scenesAppearing.join(', ')}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white">{cost.name}</h3>
                    <div className="text-xs text-amber-400">Worn by: {char?.canonicalName}</div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div>
                      <strong className="text-slate-400">Garment Breakdown:</strong> {cost.garments}
                    </div>
                    <div>
                      <strong className="text-slate-400">Regional Fabrics:</strong> {cost.fabrics}
                    </div>
                    <div>
                      <strong className="text-slate-400">Headwear & Ornaments:</strong> {cost.headwear} • {cost.jewelry}
                    </div>
                  </div>

                  {/* Color Swatches */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] text-slate-400 font-semibold">Approved Palette:</span>
                    {cost.colors.map((c, i) => (
                      <span
                        key={i}
                        className="w-4 h-4 rounded-full border border-slate-600 shadow-sm"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => handleOpenRegenerate(cost)}
                    className="w-full py-2 bg-slate-800/80 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-700 hover:border-amber-500/40 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Regenerate Costume Visual</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Scene Keyframes Storyboard */}
      {activeTab === 'keyframes' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {project.scenes.map(scene => (
            <div
              key={scene.sceneId}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col space-y-4 hover:border-amber-500/40 transition-all"
            >
              {/* 16:9 Widescreen Keyframe Frame */}
              <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden border-b border-slate-800">
                {scene.keyframeSpec.imageUrl ? (
                  <img
                    src={scene.keyframeSpec.imageUrl}
                    alt={scene.heading}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">
                    <Layers className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-amber-300 text-xs font-mono font-bold border border-white/10">
                    {scene.sceneId}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-900/90 backdrop-blur-md text-slate-300 text-xs font-mono border border-slate-700">
                    {scene.timeOfDay}
                  </span>
                </div>
              </div>

              {/* Storyboard Specifications */}
              <div className="p-6 pt-0 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">{scene.heading}</h3>
                    <div className="text-xs text-amber-400/90 font-medium mt-0.5">
                      {scene.dramaticPurpose}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                  <div>
                    <strong className="text-slate-400 block mb-0.5">Camera Framing:</strong>
                    <span className="text-slate-200">{scene.keyframeSpec.cameraFraming}</span>
                  </div>
                  <div>
                    <strong className="text-slate-400 block mb-0.5">Character Blocking:</strong>
                    <span className="text-slate-200">{scene.keyframeSpec.characterBlocking}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenRegenerate(scene)}
                  className="w-full py-2 bg-slate-800/80 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-700 hover:border-amber-500/40 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Regenerate Keyframe Storyboard</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Single Asset Retry / Regeneration Modal */}
      {regenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 max-w-lg w-full rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Single Asset Retry & Seed Control</h3>
              </div>
              <button
                onClick={() => setRegenModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Fine-tune the generative specification or lock the seed to retry this individual asset without rebuilding the entire project.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Generative Prompt Specification:
                </label>
                <textarea
                  value={customPrompt}
                  onChange={e => setCustomPrompt(e.target.value)}
                  rows={4}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Locked Continuity Seed:
                  </label>
                  <button
                    onClick={() => setCustomSeed(Math.floor(Math.random() * 1000000))}
                    className="text-[11px] text-amber-400 hover:underline"
                  >
                    Randomize Seed
                  </button>
                </div>
                <input
                  type="number"
                  value={customSeed}
                  onChange={e => setCustomSeed(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setRegenModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteRegenerate}
                disabled={isRegenerating}
                className="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl flex items-center space-x-1.5"
              >
                {isRegenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Regenerating Asset...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Regenerate</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
