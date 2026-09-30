'use client';

import React, { useState } from 'react';
import { ScreenplayProject, CanonicalCharacter, CanonicalCostume, ExtractedScene } from '@/types';
import {
  Users,
  Shirt,
  Layers,
  RefreshCw,
  Copy,
  Check,
  ArrowRight,
  Camera,
  Image as ImageIcon,
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

  const handleExecuteRegenerate = async () => {
    setIsRegenerating(true);
    let generatedImageUrl: string | undefined;

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: customPrompt,
          aspectRatio: activeTab === 'keyframes' ? '16:9' : '3:4',
        }),
      });
      const data = await res.json();
      if (data.success && data.imageUrl) {
        generatedImageUrl = data.imageUrl;
      }
    } catch (err) {
      console.warn('Live image generation failed, preserving approved visual:', err);
    }

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
                    imageUrl: generatedImageUrl || c.visualSpec.imageUrl,
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
                    imageUrl: generatedImageUrl || c.visualSpec.imageUrl,
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
                    imageUrl: generatedImageUrl || s.keyframeSpec.imageUrl,
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
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">Visual Production Bible</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Consistent character face morphology, costume breakdowns, and 16:9 widescreen storyboard keyframes.
          </p>
        </div>

        <button
          onClick={onProceed}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 hover:bg-white text-zinc-950 flex items-center space-x-1.5 transition-colors"
        >
          <span>Continuity & Export Hub</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 space-x-6 text-xs font-mono">
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
              className={`pb-2.5 flex items-center space-x-2 border-b-2 transition-colors ${
                isActive
                  ? 'border-zinc-200 text-zinc-100 font-semibold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Characters */}
      {activeTab === 'characters' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {project.characters.map(char => (
            <div
              key={char.id}
              className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Image Container */}
                <div className="relative aspect-[3/4] w-full bg-zinc-950 overflow-hidden border-b border-zinc-800">
                  {char.visualSpec.imageUrl ? (
                    <img
                      src={char.visualSpec.imageUrl}
                      alt={char.canonicalName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-700">
                      <ImageIcon className="w-10 h-10" />
                    </div>
                  )}
                  <div className="absolute top-2.5 left-2.5 flex gap-1.5 font-mono text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-black/80 text-zinc-200 border border-zinc-700">
                      {char.id}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-black/80 text-zinc-400 border border-zinc-700">
                      Seed: {char.visualSpec.lockedSeed}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-3 text-xs">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-100">{char.canonicalName}</h3>
                    <div className="text-zinc-400 text-[11px]">{char.socialRole} • Age {char.age}</div>
                  </div>

                  <div className="space-y-1 text-zinc-400 text-[11px]">
                    <div><span className="text-zinc-500">Facial traits:</span> {char.visualSpec.facialFeatures}</div>
                    <div><span className="text-zinc-500">Grooming:</span> {char.visualSpec.grooming}</div>
                  </div>

                  {/* Prompt Spec */}
                  <div className="p-2.5 bg-zinc-950 rounded border border-zinc-800 text-[11px] space-y-1 font-mono">
                    <div className="flex items-center justify-between text-zinc-500 text-[10px]">
                      <span>Prompt Specification</span>
                      <button
                        onClick={() => copyToClipboard(char.visualSpec.promptText)}
                        className="hover:text-zinc-300"
                        title="Copy prompt"
                      >
                        {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                    <p className="text-zinc-400 line-clamp-2 text-[10px] leading-relaxed">
                      {char.visualSpec.promptText}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-4 pt-0">
                <button
                  onClick={() => handleOpenRegenerate(char)}
                  className="w-full py-2 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-lg text-xs font-mono transition-colors flex items-center justify-center space-x-1.5"
                >
                  <RefreshCw className="w-3 h-3 text-zinc-400" />
                  <span>Retry Asset / Seed</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Costumes */}
      {activeTab === 'costumes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {project.costumes.map(cost => {
            const char = project.characters.find(c => c.id === cost.characterId);
            return (
              <div
                key={cost.id}
                className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[3/4] w-full bg-zinc-950 overflow-hidden border-b border-zinc-800">
                    {cost.visualSpec.imageUrl ? (
                      <img
                        src={cost.visualSpec.imageUrl}
                        alt={cost.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-700">
                        <Shirt className="w-10 h-10" />
                      </div>
                    )}
                    <div className="absolute top-2.5 left-2.5 flex gap-1.5 font-mono text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-black/80 text-zinc-200 border border-zinc-700">
                        {cost.id}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2 text-xs">
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-100">{cost.name}</h3>
                      <div className="text-zinc-400 text-[11px]">Actor: {char?.canonicalName}</div>
                    </div>

                    <div className="text-zinc-400 text-[11px] space-y-0.5">
                      <div><span className="text-zinc-500">Garments:</span> {cost.garments}</div>
                      <div><span className="text-zinc-500">Fabrics:</span> {cost.fabrics}</div>
                      <div><span className="text-zinc-500">Headwear:</span> {cost.headwear}</div>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-zinc-500 font-mono">Palette:</span>
                      {cost.colors.map((c, i) => (
                        <span
                          key={i}
                          className="w-3.5 h-3.5 rounded-full border border-zinc-700"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => handleOpenRegenerate(cost)}
                    className="w-full py-2 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-lg text-xs font-mono transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <RefreshCw className="w-3 h-3 text-zinc-400" />
                    <span>Retry Asset / Seed</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Keyframes */}
      {activeTab === 'keyframes' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {project.scenes.map(scene => (
            <div
              key={scene.sceneId}
              className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* 16:9 Widescreen */}
                <div className="relative aspect-[16/9] w-full bg-zinc-950 overflow-hidden border-b border-zinc-800">
                  {scene.keyframeSpec.imageUrl ? (
                    <img
                      src={scene.keyframeSpec.imageUrl}
                      alt={scene.heading}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-700">
                      <Layers className="w-10 h-10" />
                    </div>
                  )}
                  <div className="absolute top-2.5 left-2.5 flex gap-1.5 font-mono text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-black/80 text-zinc-200 border border-zinc-700">
                      {scene.sceneId}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-black/80 text-zinc-400 border border-zinc-700">
                      {scene.timeOfDay}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2 text-xs">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-100">{scene.heading}</h3>
                    <div className="text-zinc-400 text-[11px]">{scene.dramaticPurpose}</div>
                  </div>

                  <div className="p-2.5 bg-zinc-950 rounded border border-zinc-800 text-[11px] grid grid-cols-2 gap-2 text-zinc-400">
                    <div><span className="text-zinc-500 block">Framing:</span> {scene.keyframeSpec.cameraFraming}</div>
                    <div><span className="text-zinc-500 block">Blocking:</span> {scene.keyframeSpec.characterBlocking}</div>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => handleOpenRegenerate(scene)}
                  className="w-full py-2 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-lg text-xs font-mono transition-colors flex items-center justify-center space-x-1.5"
                >
                  <RefreshCw className="w-3 h-3 text-zinc-400" />
                  <span>Retry Asset / Seed</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Regeneration Modal */}
      {regenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 max-w-lg w-full rounded-xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-100">Asset Specification & Seed Control</h3>
              <button onClick={() => setRegenModalOpen(false)} className="text-zinc-500 hover:text-zinc-300 text-xs">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1 font-mono text-[11px]">Prompt Specification:</label>
                <textarea
                  value={customPrompt}
                  onChange={e => setCustomPrompt(e.target.value)}
                  rows={4}
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 font-mono focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1 text-[11px] font-mono">
                  <label className="text-zinc-400">Locked Seed:</label>
                  <button
                    onClick={() => setCustomSeed(Math.floor(Math.random() * 1000000))}
                    className="text-zinc-400 hover:text-zinc-200"
                  >
                    Randomize
                  </button>
                </div>
                <input
                  type="number"
                  value={customSeed}
                  onChange={e => setCustomSeed(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-100 focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setRegenModalOpen(false)}
                className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteRegenerate}
                disabled={isRegenerating}
                className="px-3 py-1.5 text-xs font-semibold bg-zinc-100 text-zinc-950 hover:bg-white rounded-lg flex items-center space-x-1.5"
              >
                {isRegenerating ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Regenerating...</span>
                  </>
                ) : (
                  <span>Save & Regenerate</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
