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
  GitMerge,
  ArrowRight,
  ShieldCheck,
  Info,
  Check,
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
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">Structured Breakdown & Continuity</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Audit canonical entities, cross-scene prop inventories, and resolve continuity warnings.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setMergeModalOpen(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/80 flex items-center space-x-1.5 transition-colors"
          >
            <GitMerge className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
            <span>Merge Alias</span>
          </button>

          <button
            onClick={handleToggleApproval}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center space-x-1.5 ${
              project.approvalStatus.entitiesApproved
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                : 'bg-zinc-900 border-zinc-700 text-zinc-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{project.approvalStatus.entitiesApproved ? 'Entities Approved' : 'Approve Entities'}</span>
          </button>

          <button
            onClick={onProceed}
            disabled={!project.approvalStatus.entitiesApproved}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 hover:bg-white text-zinc-950 flex items-center space-x-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="hidden sm:inline">Proceed to Adaptation</span>
            <span className="inline sm:hidden">Proceed</span>
            <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
          </button>
        </div>
      </div>

      {/* Contradiction Warning Panel */}
      {auditIssues.length > 0 && (
        <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-4 text-xs space-y-3">
          <div className="flex items-center justify-between text-amber-300 font-semibold font-mono text-[11px] gap-2">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>CONTINUITY CONTRADICTIONS ({auditIssues.length})</span>
            </div>
            <span className="text-zinc-500 hidden sm:inline">Must be resolved before visual generation</span>
          </div>
          {auditIssues.map(issue => (
            <div key={issue.id} className="p-3 bg-zinc-950/80 rounded-lg border border-amber-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-mono text-zinc-400">[{issue.sceneId}]</span>{' '}
                <span className="text-zinc-200">{issue.description}</span>
                <div className="text-zinc-400 text-[11px] mt-0.5">
                  <span className="text-emerald-400">Fix:</span> {issue.suggestedFix}
                </div>
              </div>
              <button
                onClick={() => handleResolveContradiction(issue.id)}
                className="px-2.5 py-1.5 sm:py-1 bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-amber-500/30 rounded text-xs font-mono whitespace-nowrap self-start sm:self-auto"
              >
                Auto-Resolve
              </button>
            </div>
          ))}
        </div>
      )}

      {/* View Tabs - Horizontally scrollable on mobile */}
      <div className="flex border-b border-zinc-800 space-x-3 sm:space-x-6 text-xs overflow-x-auto scrollbar-none pb-0.5 -mx-3 px-3 sm:mx-0 sm:px-0">
        {[
          { id: 'scenes', label: `Scenes (${project.scenes.length})`, icon: Layers },
          { id: 'characters', label: `Canonical Characters (${project.characters.length})`, icon: Users },
          { id: 'costumes', label: `Costumes (${project.costumes.length})`, icon: Shirt },
          { id: 'props', label: `Props (${project.props.length})`, icon: Box },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-2.5 flex items-center space-x-2 border-b-2 transition-colors font-mono text-xs whitespace-nowrap flex-shrink-0 ${
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

      {/* Tab 1: Scenes */}
      {activeTab === 'scenes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Scene List */}
          <div className="lg:col-span-4 space-y-2">
            {project.scenes.map(scene => {
              const isSelected = selectedSceneId === scene.sceneId;
              return (
                <button
                  key={scene.sceneId}
                  onClick={() => setSelectedSceneId(scene.sceneId)}
                  className={`w-full text-left p-3.5 rounded-lg border transition-colors ${
                    isSelected
                      ? 'bg-zinc-800 border-zinc-600 text-zinc-100'
                      : 'bg-zinc-900/50 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="text-zinc-300 font-semibold">{scene.sceneId}</span>
                    <span className="px-1.5 py-0.5 bg-zinc-950 rounded text-zinc-500">{scene.intExt}</span>
                  </div>
                  <div className="text-xs font-medium text-zinc-200 mt-1 truncate">{scene.heading}</div>
                  <div className="text-[11px] text-zinc-500 mt-0.5 line-clamp-1">{scene.dramaticPurpose}</div>
                </button>
              );
            })}
          </div>

          {/* Scene Detail */}
          <div className="lg:col-span-8 bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-zinc-800">
              <div>
                <span className="text-[11px] font-mono text-zinc-500 uppercase">{selectedScene.sceneId} • {selectedScene.timeOfDay}</span>
                <h2 className="text-base font-semibold text-zinc-100 mt-0.5">{selectedScene.heading}</h2>
              </div>
              <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-700 rounded text-[11px] text-zinc-300 font-mono">
                {selectedScene.mood}
              </span>
            </div>

            {/* Purpose & Emotional Change */}
            <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs space-y-1">
              <div className="text-zinc-400 font-mono text-[11px] uppercase font-semibold">Dramatic Function</div>
              <p className="text-zinc-200">{selectedScene.dramaticPurpose}</p>
              <div className="text-zinc-400 text-[11px] pt-1">
                <span className="text-zinc-500">Emotional shift:</span> {selectedScene.emotionalChange}
              </div>
            </div>

            {/* Grid of Characters & Props */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-lg space-y-2">
                <div className="font-mono text-[11px] text-zinc-400 uppercase font-semibold">Characters & Costumes</div>
                <div className="space-y-1">
                  {selectedScene.charactersPresent.map(charId => {
                    const char = project.characters.find(c => c.id === charId);
                    const costId = selectedScene.costumesActive[charId];
                    return (
                      <div key={charId} className="flex items-center justify-between p-1.5 bg-zinc-900 rounded text-zinc-300 text-[11px]">
                        <span>{char?.canonicalName || charId}</span>
                        <span className="font-mono text-zinc-500">{costId}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-lg space-y-2">
                <div className="font-mono text-[11px] text-zinc-400 uppercase font-semibold">Active Props</div>
                <div className="space-y-1">
                  {selectedScene.propsIn.map(propId => {
                    const prop = project.props.find(p => p.id === propId);
                    return (
                      <div key={propId} className="flex items-center justify-between p-1.5 bg-zinc-900 rounded text-zinc-300 text-[11px]">
                        <span>{prop?.name || propId}</span>
                        <span className="font-mono text-emerald-400 text-[10px]">Carried</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Characters */}
      {activeTab === 'characters' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {project.characters.map(char => (
            <div key={char.id} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[11px] text-zinc-500 font-semibold">{char.id}</span>
                  <h3 className="text-sm font-semibold text-zinc-100">{char.canonicalName}</h3>
                  <div className="text-xs text-zinc-400">{char.socialRole} • Age {char.age}</div>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 bg-zinc-950 text-zinc-400 rounded border border-zinc-800">
                  Seed: {char.visualSpec.lockedSeed}
                </span>
              </div>

              <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800/80 text-xs">
                <span className="text-zinc-500 font-mono text-[11px] block mb-1">Merged Aliases:</span>
                <div className="flex flex-wrap gap-1">
                  {char.aliases.map((a, i) => (
                    <span key={i} className="px-2 py-0.5 bg-zinc-900 text-zinc-300 rounded font-mono text-[11px]">
                      &quot;{a}&quot;
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-xs text-zinc-400 space-y-1">
                <div><span className="text-zinc-500">Personality:</span> {char.personality}</div>
                <div><span className="text-zinc-500">Facial traits:</span> {char.visualSpec.facialFeatures}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Costumes */}
      {activeTab === 'costumes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {project.costumes.map(cost => (
            <div key={cost.id} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-2.5 text-xs">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="font-semibold text-zinc-300">{cost.id}</span>
                <span className="text-zinc-500">Scenes: {cost.scenesAppearing.join(', ')}</span>
              </div>
              <h3 className="text-sm font-semibold text-zinc-100">{cost.name}</h3>
              <p className="text-zinc-300"><span className="text-zinc-500">Garments:</span> {cost.garments}</p>
              <p className="text-zinc-300"><span className="text-zinc-500">Fabrics:</span> {cost.fabrics}</p>
              <p className="text-zinc-300"><span className="text-zinc-500">Ornaments:</span> {cost.headwear} • {cost.jewelry}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Props */}
      {activeTab === 'props' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {project.props.map(prop => (
            <div key={prop.id} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-2 text-xs">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="font-semibold text-zinc-300">{prop.id}</span>
                <span className="text-zinc-500">Scenes: {prop.scenesInvolved.join(' $\\rightarrow$ ')}</span>
              </div>
              <h3 className="text-sm font-semibold text-zinc-100">{prop.name}</h3>
              <p className="text-zinc-400">{prop.description}</p>
              <div className="p-2 bg-zinc-950 rounded border border-zinc-800 text-[11px] text-zinc-300">
                <span className="text-zinc-500">Regional equivalent:</span> {prop.culturalEquivalent}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Deduplication Modal */}
      {mergeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 max-w-md w-full rounded-xl p-4 sm:p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-100">Merge Alias to Canonical Entity</h3>
              <button onClick={() => setMergeModalOpen(false)} className="text-zinc-500 hover:text-zinc-300 text-xs">
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              Merge alternative script names into one canonical ID to prevent duplicate character generation.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1 font-mono text-[11px]">Script Mention:</label>
                <input
                  type="text"
                  value={aliasToMerge}
                  onChange={e => setAliasToMerge(e.target.value)}
                  placeholder='e.g., "A. Singh"'
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-mono text-[11px]">Target Canonical Character:</label>
                <select
                  value={targetCharId}
                  onChange={e => setTargetCharId(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-zinc-500"
                >
                  {project.characters.map(c => (
                    <option key={c.id} value={c.id}>
                      [{c.id}] {c.canonicalName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setMergeModalOpen(false)}
                className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                onClick={handleMergeAlias}
                className="px-3 py-1.5 text-xs font-semibold bg-zinc-100 text-zinc-950 hover:bg-white rounded-lg"
              >
                Merge Alias
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
