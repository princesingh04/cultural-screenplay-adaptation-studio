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
  Sparkles,
  SlidersHorizontal,
  AlertCircle,
  X,
  Info,
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
  const [selectedAsset, setSelectedAsset] = useState<any>(project.characters[0] || null);
  const [regenModalOpen, setRegenModalOpen] = useState<boolean>(false);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [customSeed, setCustomSeed] = useState<number>(749201);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [generatingAssetId, setGeneratingAssetId] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const handleOpenRegenerate = (asset: any) => {
    setSelectedAsset(asset);
    setCustomPrompt(asset.visualSpec?.promptText || asset.keyframeSpec?.promptText || '');
    setCustomSeed(asset.visualSpec?.lockedSeed || asset.keyframeSpec?.lockedSeed || Math.floor(Math.random() * 1000000));
    setModalError(null);
    setRegenModalOpen(true);
  };

  const handleDirectGenerate = async (asset: any, type: 'characters' | 'costumes' | 'keyframes') => {
    const assetId = asset.id || asset.sceneId;
    setGeneratingAssetId(assetId);
    setGlobalError(null);

    const storedTogetherKey = typeof window !== 'undefined' ? localStorage.getItem('together_api_key') || '' : '';
    const storedGeminiKey = typeof window !== 'undefined' ? localStorage.getItem('gemini_api_key') || '' : '';

    const prompt = asset.visualSpec?.promptText || asset.keyframeSpec?.promptText;
    const seed = asset.visualSpec?.lockedSeed || asset.keyframeSpec?.lockedSeed;
    const aspectRatio = type === 'keyframes' ? '16:9' : '3:4';

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          aspectRatio,
          seed,
          togetherApiKey: storedTogetherKey,
          userApiKey: storedGeminiKey,
        }),
      });

      const data = await res.json();
      if (data.success && data.imageUrl) {
        applyGeneratedImage(assetId, type, data.imageUrl, prompt, seed);
      } else {
        setGlobalError(data.error || 'Image generation failed. Please verify your Together AI API key.');
      }
    } catch (err: any) {
      setGlobalError(err.message || 'Network error connecting to image generation service.');
    } finally {
      setGeneratingAssetId(null);
    }
  };

  const applyGeneratedImage = (
    assetId: string,
    type: 'characters' | 'costumes' | 'keyframes',
    imageUrl: string,
    promptText?: string,
    lockedSeed?: number
  ) => {
    setProject(prev => {
      if (type === 'characters') {
        return {
          ...prev,
          characters: prev.characters.map(c =>
            c.id === assetId
              ? {
                  ...c,
                  visualSpec: {
                    ...c.visualSpec,
                    imageUrl,
                    ...(promptText ? { promptText } : {}),
                    ...(lockedSeed ? { lockedSeed } : {}),
                  },
                }
              : c
          ),
        };
      } else if (type === 'costumes') {
        return {
          ...prev,
          costumes: prev.costumes.map(c =>
            c.id === assetId
              ? {
                  ...c,
                  visualSpec: {
                    ...c.visualSpec,
                    imageUrl,
                    ...(promptText ? { promptText } : {}),
                    ...(lockedSeed ? { lockedSeed } : {}),
                  },
                }
              : c
          ),
        };
      } else {
        return {
          ...prev,
          scenes: prev.scenes.map(s =>
            s.sceneId === assetId
              ? {
                  ...s,
                  keyframeSpec: {
                    ...s.keyframeSpec,
                    imageUrl,
                    ...(promptText ? { promptText } : {}),
                    ...(lockedSeed ? { lockedSeed } : {}),
                  },
                }
              : s
          ),
        };
      }
    });
  };

  const handleExecuteRegenerate = async () => {
    if (!selectedAsset) return;
    setIsRegenerating(true);
    setModalError(null);

    const assetId = selectedAsset.id || selectedAsset.sceneId;
    const storedTogetherKey = typeof window !== 'undefined' ? localStorage.getItem('together_api_key') || '' : '';
    const storedGeminiKey = typeof window !== 'undefined' ? localStorage.getItem('gemini_api_key') || '' : '';

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: customPrompt,
          aspectRatio: activeTab === 'keyframes' ? '16:9' : '3:4',
          seed: customSeed,
          togetherApiKey: storedTogetherKey,
          userApiKey: storedGeminiKey,
        }),
      });

      const data = await res.json();
      if (data.success && data.imageUrl) {
        applyGeneratedImage(assetId, activeTab, data.imageUrl, customPrompt, customSeed);
        setIsRegenerating(false);
        setRegenModalOpen(false);
      } else {
        setModalError(data.error || 'Failed to generate visual. Check Together AI key or quota.');
        setIsRegenerating(false);
      }
    } catch (err: any) {
      setModalError(err.message || 'Image generation network error.');
      setIsRegenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const renderBadge = (imageUrl?: string) => {
    if (imageUrl && (imageUrl.startsWith('data:') || imageUrl.startsWith('http'))) {
      return (
        <span className="px-2 py-0.5 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 flex items-center gap-1 shadow-sm">
          <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
          <span>FLUX Generated</span>
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded bg-zinc-900/90 text-zinc-500 border border-zinc-800 text-[10px] font-mono">
        No Picture
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">Visual Production Bible</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Consistent face morphology, costume specifications, and 16:9 storyboard keyframes generated with FLUX.1.1-pro.
          </p>
        </div>

        <button
          onClick={onProceed}
          className="w-full sm:w-auto px-3.5 py-2 sm:py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 hover:bg-white text-zinc-950 flex items-center justify-center space-x-1.5 transition-colors"
        >
          <span>Continuity & Export Hub</span>
          <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
        </button>
      </div>

      {/* Info Notice */}
      <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-lg flex items-start gap-2.5 text-xs text-zinc-300">
        <Info className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-zinc-200">On-Demand Picture Generation:</span> By default, no images are pre-loaded. Click <strong>Generate Picture</strong> on any character, costume, or scene to render with Together AI (<code className="text-zinc-400 font-mono text-[11px]">FLUX.1.1-pro</code>). Once a picture is generated, you can click <strong>Regenerate Picture</strong> to create variations.
        </div>
      </div>

      {/* Global Error Banner */}
      {globalError && (
        <div className="p-3 bg-rose-950/60 border border-rose-500/50 rounded-lg flex items-center justify-between gap-3 text-xs text-rose-200">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{globalError}</span>
          </div>
          <button
            onClick={() => setGlobalError(null)}
            className="text-rose-400 hover:text-rose-200"
            title="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs - Smooth touch horizontal scrolling on mobile */}
      <div className="flex border-b border-zinc-800 space-x-3 sm:space-x-6 text-xs font-mono overflow-x-auto scrollbar-none pb-0.5 -mx-3 px-3 sm:mx-0 sm:px-0">
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
              className={`pb-2.5 flex items-center space-x-2 border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {project.characters.map(char => {
            const isCurrentlyGenerating = generatingAssetId === char.id;
            const hasImage = Boolean(char.visualSpec.imageUrl);

            return (
              <div
                key={char.id}
                className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition-colors"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] w-full bg-zinc-950 overflow-hidden border-b border-zinc-800 flex items-center justify-center">
                    {char.visualSpec.imageUrl ? (
                      <img
                        src={char.visualSpec.imageUrl}
                        alt={char.canonicalName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-zinc-950/80">
                        <Camera className="w-10 h-10 text-zinc-700 mb-2 stroke-[1.5]" />
                        <div className="text-xs font-medium text-zinc-300">Picture Not Generated</div>
                        <div className="text-[10px] text-zinc-500 max-w-[200px] mt-1 font-mono">
                          Click below to generate character picture with FLUX.1.1-pro
                        </div>
                      </div>
                    )}

                    {/* Top Overlay Badges */}
                    <div className="absolute top-2.5 left-2.5 flex gap-1.5 font-mono text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-black/85 text-zinc-200 border border-zinc-700">
                        {char.id}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-black/85 text-zinc-400 border border-zinc-700">
                        Seed: {char.visualSpec.lockedSeed}
                      </span>
                    </div>

                    <div className="absolute top-2.5 right-2.5 font-mono text-[10px]">
                      {renderBadge(char.visualSpec.imageUrl)}
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

                {/* Actions */}
                <div className="p-4 pt-0 flex gap-2">
                  <button
                    onClick={() => handleDirectGenerate(char, 'characters')}
                    disabled={isCurrentlyGenerating}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono transition-all flex items-center justify-center space-x-1.5 ${
                      isCurrentlyGenerating
                        ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed'
                        : hasImage
                        ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-950/40'
                    }`}
                  >
                    {isCurrentlyGenerating ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>{hasImage ? 'Regenerating Picture...' : 'Generating Picture...'}</span>
                      </>
                    ) : (
                      <>
                        {hasImage ? <RefreshCw className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                        <span>{hasImage ? 'Regenerate Picture' : 'Generate Picture'}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleOpenRegenerate(char)}
                    title="Edit Prompt & Locked Seed"
                    className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 rounded-lg text-xs transition-colors"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Costumes */}
      {activeTab === 'costumes' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {project.costumes.map(cost => {
            const char = project.characters.find(c => c.id === cost.characterId);
            const isCurrentlyGenerating = generatingAssetId === cost.id;
            const hasImage = Boolean(cost.visualSpec.imageUrl);

            return (
              <div
                key={cost.id}
                className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition-colors"
              >
                <div>
                  <div className="relative aspect-[3/4] w-full bg-zinc-950 overflow-hidden border-b border-zinc-800 flex items-center justify-center">
                    {cost.visualSpec.imageUrl ? (
                      <img
                        src={cost.visualSpec.imageUrl}
                        alt={cost.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-zinc-950/80">
                        <Shirt className="w-10 h-10 text-zinc-700 mb-2 stroke-[1.5]" />
                        <div className="text-xs font-medium text-zinc-300">Costume Picture Not Generated</div>
                        <div className="text-[10px] text-zinc-500 max-w-[200px] mt-1 font-mono">
                          Click below to generate costume picture with FLUX
                        </div>
                      </div>
                    )}

                    <div className="absolute top-2.5 left-2.5 flex gap-1.5 font-mono text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-black/85 text-zinc-200 border border-zinc-700">
                        {cost.id}
                      </span>
                    </div>

                    <div className="absolute top-2.5 right-2.5 font-mono text-[10px]">
                      {renderBadge(cost.visualSpec.imageUrl)}
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

                <div className="p-4 pt-0 flex gap-2">
                  <button
                    onClick={() => handleDirectGenerate(cost, 'costumes')}
                    disabled={isCurrentlyGenerating}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono transition-all flex items-center justify-center space-x-1.5 ${
                      isCurrentlyGenerating
                        ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed'
                        : hasImage
                        ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-950/40'
                    }`}
                  >
                    {isCurrentlyGenerating ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>{hasImage ? 'Regenerating Costume...' : 'Generating Costume...'}</span>
                      </>
                    ) : (
                      <>
                        {hasImage ? <RefreshCw className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                        <span>{hasImage ? 'Regenerate Costume Picture' : 'Generate Costume Picture'}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleOpenRegenerate(cost)}
                    title="Edit Prompt & Locked Seed"
                    className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 rounded-lg text-xs transition-colors"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Keyframes */}
      {activeTab === 'keyframes' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {project.scenes.map(scene => {
            const isCurrentlyGenerating = generatingAssetId === scene.sceneId;
            const hasImage = Boolean(scene.keyframeSpec.imageUrl);

            return (
              <div
                key={scene.sceneId}
                className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition-colors"
              >
                <div>
                  {/* 16:9 Widescreen */}
                  <div className="relative aspect-[16/9] w-full bg-zinc-950 overflow-hidden border-b border-zinc-800 flex items-center justify-center">
                    {scene.keyframeSpec.imageUrl ? (
                      <img
                        src={scene.keyframeSpec.imageUrl}
                        alt={scene.heading}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-zinc-950/80">
                        <Layers className="w-10 h-10 text-zinc-700 mb-2 stroke-[1.5]" />
                        <div className="text-xs font-medium text-zinc-300">Keyframe Picture Not Generated</div>
                        <div className="text-[10px] text-zinc-500 max-w-[280px] mt-1 font-mono">
                          Click below to generate 16:9 storyboard keyframe
                        </div>
                      </div>
                    )}

                    <div className="absolute top-2.5 left-2.5 flex gap-1.5 font-mono text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-black/85 text-zinc-200 border border-zinc-700">
                        {scene.sceneId}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-black/85 text-zinc-400 border border-zinc-700">
                        {scene.timeOfDay}
                      </span>
                    </div>

                    <div className="absolute top-2.5 right-2.5 font-mono text-[10px]">
                      {renderBadge(scene.keyframeSpec.imageUrl)}
                    </div>
                  </div>

                  <div className="p-4 space-y-2 text-xs">
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-100">{scene.heading}</h3>
                      <div className="text-zinc-400 text-[11px]">{scene.dramaticPurpose}</div>
                    </div>

                    <div className="p-2.5 bg-zinc-950 rounded border border-zinc-800 text-[11px] grid grid-cols-2 gap-2 text-zinc-400 font-mono">
                      <div><span className="text-zinc-500 block">Framing:</span> {scene.keyframeSpec.cameraFraming}</div>
                      <div><span className="text-zinc-500 block">Atmosphere:</span> {scene.keyframeSpec.culturalAtmosphere || scene.mood}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 flex gap-2">
                  <button
                    onClick={() => handleDirectGenerate(scene, 'keyframes')}
                    disabled={isCurrentlyGenerating}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono transition-all flex items-center justify-center space-x-1.5 ${
                      isCurrentlyGenerating
                        ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed'
                        : hasImage
                        ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-950/40'
                    }`}
                  >
                    {isCurrentlyGenerating ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>{hasImage ? 'Regenerating 16:9 Keyframe...' : 'Generating 16:9 Keyframe...'}</span>
                      </>
                    ) : (
                      <>
                        {hasImage ? <RefreshCw className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                        <span>{hasImage ? 'Regenerate Keyframe Picture' : 'Generate Keyframe Picture'}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleOpenRegenerate(scene)}
                    title="Edit Prompt & Locked Seed"
                    className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 rounded-lg text-xs transition-colors"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Regeneration Modal */}
      {regenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 max-w-lg w-full rounded-xl p-4 sm:p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-zinc-100">Visual Specification & Seed Control</h3>
                <p className="text-[11px] text-zinc-400">Target Model: FLUX.1.1-pro via Together AI</p>
              </div>
              <button
                onClick={() => setRegenModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 text-xs p-1"
              >
                ✕
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-rose-950/60 border border-rose-500/50 rounded-lg flex items-center space-x-2 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1 font-mono text-[11px]">Cinematic Prompt Specification:</label>
                <textarea
                  value={customPrompt}
                  onChange={e => setCustomPrompt(e.target.value)}
                  rows={4}
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 font-mono focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1 text-[11px] font-mono">
                  <label className="text-zinc-400">Locked Random Seed:</label>
                  <button
                    onClick={() => setCustomSeed(Math.floor(Math.random() * 1000000))}
                    className="text-emerald-400 hover:text-emerald-300"
                  >
                    Randomize Seed
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
                className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center space-x-1.5 transition-colors"
              >
                {isRegenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Rendering with FLUX...</span>
                  </>
                ) : (
                  <>
                    {selectedAsset?.visualSpec?.imageUrl || selectedAsset?.keyframeSpec?.imageUrl ? (
                      <RefreshCw className="w-3.5 h-3.5" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {selectedAsset?.visualSpec?.imageUrl || selectedAsset?.keyframeSpec?.imageUrl
                        ? 'Regenerate Picture'
                        : 'Generate Picture'}
                    </span>
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
