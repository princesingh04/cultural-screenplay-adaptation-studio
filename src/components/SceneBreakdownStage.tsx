'use client';

import React, { useState } from 'react';
import { ScreenplayProject, CanonicalCharacter, CanonicalCostume, CanonicalProp, ExtractedScene } from '@/types';
import { runContinuityAudit } from '@/services/continuityEngine';
import {
  Layers,
  Users,
  Shirt,
  Box,
  AlertTriangle,
  CheckCircle2,
  GitMerge,
  ArrowRight,
  Eye,
  Sliders,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Info,
} from 'lucide-react';

interface SceneBreakdownStageProps {
  project: ScreenplayProject;
  setProject: React.Dispatch<React.SetStateAction<ScreenplayProject>>;
  onProceed: () => void;
}

export const SceneBreakdownStage: React.FC<SceneBreakdownStageProps> = ({
  project,
  setProject,
  onProceed,
}) => {
  const [activeTab, setActiveTab] = useState<'scenes' | 'characters' | 'costumes' | 'props'>('scenes');
  const [selectedSceneId, setSelectedSceneId] = useState<string>(project.scenes[0]?.sceneId || 'SC01');
  const [mergeModalOpen, setMergeModalOpen] = useState<boolean>(false);
  const [aliasToMerge, setAliasToMerge] = useState<string>('');
  const [targetCharId, setTargetCharId] = useState<string>('CHAR_AMAR');

  const selectedScene = project.scenes.find(s => s.sceneId === selectedSceneId) || project.scenes[0];
  const auditIssues = runContinuityAudit(project);

  const handleMergeAlias = () => {
    if (!aliasToMerge.trim()) return;

    setProject(prev => {
      const updatedChars = prev.characters.map(char => {
        if (char.id === targetCharId) {
          if (!char.aliases.includes(aliasToMerge.trim())) {
            return {
              ...char,
              aliases: [...char.aliases, aliasToMerge.trim()],
            };
          }
        }
        return char;
      });

      return {
        ...prev,
        characters: updatedChars,
      };
    });

    setAliasToMerge('');
    setMergeModalOpen(false);
  };

  const handleToggleApproval = () => {
    setProject(prev => ({
      ...prev,
      approvalStatus: {
        ...prev.approvalStatus,
        entitiesApproved: !prev.approvalStatus.entitiesApproved,
      },
    }));
  };

  const handleResolveContradiction = (contraId: string) => {
    setProject(prev => {
      // Automatic fix: if it's prop missing in Scene 2, add it
      const updatedScenes = prev.scenes.map(sc => {
        if (sc.sceneId === 'SC02' && !sc.propsIn.includes('PROP_DEED_LETTER')) {
          return {
            ...sc,
            propsIn: [...sc.propsIn, 'PROP_DEED_LETTER'],
          };
        }
        return sc;
      });
      return {
        ...prev,
        scenes: updatedScenes,
      };
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Stage Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              STAGE 2 • EXTRACTION & CONTINUITY
            </span>
            <span className="text-xs text-slate-400 font-mono">Deduplication Gate</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Structured Extraction & Canonical Identity</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Normalized entities, cross-scene prop inventories, and contradiction safeguards before generation.
          </p>
        </div>

        {/* Action Gate Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMergeModalOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition-all"
          >
            <GitMerge className="w-3.5 h-3.5 text-amber-400" />
            <span>Merge Alias / Deduplicate</span>
          </button>

          <button
            onClick={handleToggleApproval}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center space-x-2 ${
              project.approvalStatus.entitiesApproved
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-500/20'
                : 'bg-amber-500/20 border-amber-500/50 text-amber-300'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>
              {project.approvalStatus.entitiesApproved ? 'Entities Approved' : 'Approve Canonical Records'}
            </span>
          </button>

          <button
            onClick={onProceed}
            disabled={!project.approvalStatus.entitiesApproved}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 flex items-center space-x-1.5 hover:from-amber-400 hover:to-orange-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>Continue to Adaptation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Contradiction Warning Panel if any */}
      {auditIssues.length > 0 && (
        <div className="bg-rose-950/40 border border-rose-500/40 rounded-2xl p-4 text-xs space-y-3">
          <div className="flex items-center justify-between text-rose-300 font-bold">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Continuity Contradictions Detected ({auditIssues.length})</span>
            </div>
            <span className="text-[11px] font-normal text-rose-300/80">Must resolve before visual generation</span>
          </div>
          {auditIssues.map(issue => (
            <div key={issue.id} className="p-3 bg-slate-950/70 rounded-xl border border-rose-900/60 flex items-center justify-between gap-4">
              <div>
                <span className="font-semibold text-rose-200">[{issue.sceneId}] {issue.category.replace(/_/g, ' ').toUpperCase()}:</span>{' '}
                <span className="text-slate-300">{issue.description}</span>
                <div className="text-emerald-400 mt-1">Suggested Fix: {issue.suggestedFix}</div>
              </div>
              <button
                onClick={() => handleResolveContradiction(issue.id)}
                className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-lg whitespace-nowrap font-medium"
              >
                Auto-Resolve
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Breakdown View Tabs */}
      <div className="flex border-b border-slate-800 space-x-4">
        {[
          { id: 'scenes', label: `Scenes (${project.scenes.length})`, icon: Layers },
          { id: 'characters', label: `Canonical Characters (${project.characters.length})`, icon: Users },
          { id: 'costumes', label: `Costumes (${project.costumes.length})`, icon: Shirt },
          { id: 'props', label: `Props & Inventory (${project.props.length})`, icon: Box },
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

      {/* Tab 1: Scenes View */}
      {activeTab === 'scenes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Scene List Selector */}
          <div className="lg:col-span-4 space-y-3">
            {project.scenes.map(scene => {
              const isSelected = selectedSceneId === scene.sceneId;
              return (
                <button
                  key={scene.sceneId}
                  onClick={() => setSelectedSceneId(scene.sceneId)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/60 shadow-md shadow-amber-500/5'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400">{scene.sceneId}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 rounded text-slate-300">
                      {scene.intExt}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-white mt-1 truncate">{scene.heading}</div>
                  <div className="text-xs text-slate-400 mt-1 line-clamp-1">{scene.dramaticPurpose}</div>
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Users className="w-3 h-3 text-amber-400" />
                    <span>{scene.charactersPresent.length} characters</span>
                    <span>•</span>
                    <Box className="w-3 h-3 text-amber-400" />
                    <span>{scene.propsIn.length} props</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Scene Detail Card */}
          <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                  {selectedScene.sceneId} • {selectedScene.timeOfDay}
                </span>
                <h2 className="text-xl font-bold text-white mt-0.5">{selectedScene.heading}</h2>
              </div>
              <span className="px-3 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-300 rounded-full text-xs font-medium">
                Mood: {selectedScene.mood}
              </span>
            </div>

            {/* Dramatic Purpose */}
            <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Info className="w-3.5 h-3.5 text-amber-400" />
                <span>Dramatic Purpose & Story Function</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200">{selectedScene.dramaticPurpose}</p>
              <p className="text-xs text-amber-400/90 pt-1">
                <strong>Emotional Arc Shift:</strong> {selectedScene.emotionalChange}
              </p>
            </div>

            {/* Grid of Characters & Props in Scene */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Active Characters */}
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span>Characters Present ({selectedScene.charactersPresent.length})</span>
                </div>
                <div className="space-y-1.5">
                  {selectedScene.charactersPresent.map(charId => {
                    const char = project.characters.find(c => c.id === charId);
                    const costId = selectedScene.costumesActive[charId];
                    return (
                      <div key={charId} className="flex items-center justify-between text-xs p-2 bg-slate-900/80 rounded-lg">
                        <span className="font-semibold text-slate-200">{char?.canonicalName || charId}</span>
                        <span className="font-mono text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          {costId}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Props in / Props out */}
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Box className="w-3.5 h-3.5 text-amber-400" />
                  <span>Props Tracking</span>
                </div>
                <div className="space-y-1.5">
                  {selectedScene.propsIn.map(propId => {
                    const prop = project.props.find(p => p.id === propId);
                    return (
                      <div key={propId} className="flex items-center justify-between text-xs p-2 bg-slate-900/80 rounded-lg">
                        <span className="text-slate-200 font-medium">{prop?.name || propId}</span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          In: Carried
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Character State Transitions */}
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                State & Continuity Transitions (Before $\rightarrow$ After)
              </div>
              <div className="space-y-2">
                {selectedScene.stateTransitions.map((trans, i) => {
                  const char = project.characters.find(c => c.id === trans.characterId);
                  return (
                    <div key={i} className="text-xs p-2.5 bg-slate-900/80 rounded-lg space-y-1">
                      <div className="font-bold text-amber-400">{char?.canonicalName}:</div>
                      <div className="grid grid-cols-2 gap-2 text-slate-300 text-[11px]">
                        <div><strong className="text-slate-400">Before:</strong> {trans.beforeState}</div>
                        <div><strong className="text-emerald-400">After:</strong> {trans.afterState}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Canonical Characters */}
      {activeTab === 'characters' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {project.characters.map(char => (
            <div key={char.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 bg-amber-500/10 rounded border border-amber-500/30">
                      {char.id}
                    </span>
                    <span className="text-xs text-slate-400">Age {char.age} • {char.gender}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">{char.canonicalName}</h3>
                  <p className="text-xs text-amber-300 font-medium">{char.socialRole}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/30">
                    Seed: {char.visualSpec.lockedSeed}
                  </span>
                </div>
              </div>

              {/* Deduplicated Aliases */}
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                  <GitMerge className="w-3 h-3 text-amber-400" />
                  <span>Normalized & Merged Aliases</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {char.aliases.map((alias, i) => (
                    <span key={i} className="px-2.5 py-0.5 bg-slate-800 text-slate-200 rounded-md text-xs font-mono">
                      &quot;{alias}&quot;
                    </span>
                  ))}
                </div>
              </div>

              {/* Personality & Visual Arc */}
              <div className="text-xs space-y-2 text-slate-300">
                <div><strong>Personality:</strong> {char.personality}</div>
                <div><strong>Emotional Arc:</strong> {char.emotionalArc}</div>
                <div><strong>Visual Face & Grooming:</strong> {char.visualSpec.facialFeatures}, {char.visualSpec.grooming}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Costumes */}
      {activeTab === 'costumes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {project.costumes.map(cost => (
            <div key={cost.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 bg-amber-500/10 rounded border border-amber-500/30">
                  {cost.id}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Scenes: {cost.scenesAppearing.join(', ')}
                </span>
              </div>
              <h3 className="text-base font-bold text-white">{cost.name}</h3>
              <p className="text-xs text-slate-300"><strong>Garments:</strong> {cost.garments}</p>
              <p className="text-xs text-slate-300"><strong>Regional Fabrics:</strong> {cost.fabrics}</p>
              <p className="text-xs text-slate-300"><strong>Headwear & Ornaments:</strong> {cost.headwear} • {cost.jewelry}</p>
              <div className="flex items-center gap-2 pt-2">
                <span className="text-[11px] text-slate-400 font-semibold">Palette:</span>
                {cost.colors.map((c, i) => (
                  <span
                    key={i}
                    className="w-4 h-4 rounded-full border border-slate-600 shadow-sm"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Props */}
      {activeTab === 'props' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {project.props.map(prop => (
            <div key={prop.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 bg-amber-500/10 rounded border border-amber-500/30">
                  {prop.id}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Active in {prop.scenesInvolved.join(' $\\rightarrow$ ')}
                </span>
              </div>
              <h3 className="text-base font-bold text-white">{prop.name}</h3>
              <p className="text-xs text-slate-300">{prop.description}</p>
              <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
                <strong className="text-amber-400">Cultural Equivalent:</strong> {prop.culturalEquivalent}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Deduplication Modal */}
      {mergeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 max-w-md w-full rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <GitMerge className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Merge Alias into Canonical Entity</h3>
              </div>
              <button
                onClick={() => setMergeModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Ensure duplicate script mentions (e.g., &quot;A. Singh&quot;, &quot;the elder son&quot;) point to a single canonical character ID so that duplicate actors are never generated.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Script Mention / Alias:
                </label>
                <input
                  type="text"
                  value={aliasToMerge}
                  onChange={e => setAliasToMerge(e.target.value)}
                  placeholder='e.g., "A. Singh" or "elder son"'
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Target Canonical Character:
                </label>
                <select
                  value={targetCharId}
                  onChange={e => setTargetCharId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {project.characters.map(c => (
                    <option key={c.id} value={c.id}>
                      [{c.id}] {c.canonicalName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setMergeModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleMergeAlias}
                className="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl"
              >
                Save & Normalize Alias
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
