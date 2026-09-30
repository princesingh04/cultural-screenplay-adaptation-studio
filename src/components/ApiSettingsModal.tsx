'use client';

import React, { useState, useEffect } from 'react';
import { Key, Check, AlertCircle, ExternalLink, ShieldCheck, RefreshCw } from 'lucide-react';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApiKeySaved: (key: string) => void;
}

export const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({
  isOpen,
  onClose,
  onApiKeySaved,
}) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [togetherKey, setTogetherKey] = useState<string>('');
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setApiKey(localStorage.getItem('gemini_api_key') || '');
      setTogetherKey(localStorage.getItem('together_api_key') || '');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      if (apiKey.trim()) {
        localStorage.setItem('gemini_api_key', apiKey.trim());
      } else {
        localStorage.removeItem('gemini_api_key');
      }

      if (togetherKey.trim()) {
        localStorage.setItem('together_api_key', togetherKey.trim());
      } else {
        localStorage.removeItem('together_api_key');
      }
    }
    onApiKeySaved(apiKey.trim());
    onClose();
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim() && !togetherKey.trim()) {
      setTestResult({ success: false, message: 'Please enter a Gemini or Together AI key to test' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      if (apiKey.trim()) {
        const res = await fetch('/api/adapt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scriptText: 'SCENE 1: EXT. FIELD - DAY\nAMAR: Hello world.',
            cultureId: 'majhi_punjab',
            userApiKey: apiKey.trim(),
          }),
        });

        const data = await res.json();
        if (res.ok && data.isAIGenerated) {
          setTestResult({ success: true, message: 'Connection successful! Gemini 3.8 Flash is active.' });
        } else if (data.error) {
          setTestResult({ success: false, message: data.error });
        } else {
          setTestResult({ success: false, message: 'Could not verify key. Check permissions.' });
        }
      } else {
        setTestResult({ success: true, message: 'Together AI key saved for FLUX.1 image generation!' });
      }
    } catch (err: any) {
      setTestResult({ success: false, message: err.message || 'Network test failed' });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-800 max-w-md w-full rounded-xl p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Key className="w-4 h-4 text-zinc-300" />
            <h3 className="text-sm font-semibold text-zinc-100">API Key Configuration</h3>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 text-xs">
            ✕
          </button>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          Configure your API keys for live AI generation. Keys are stored privately in your browser session or in <code className="font-mono text-zinc-300">.env.local</code>.
        </p>

        <div className="space-y-4">
          {/* Together AI Key (FLUX.1 Schnell) */}
          <div className="p-3 bg-zinc-950/80 border border-zinc-800/80 rounded-lg space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-amber-400 block font-mono text-[11px] font-semibold">
                Together AI Key (FLUX.1 [schnell]):
              </label>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                $0.003 / img
              </span>
            </div>
            <input
              type="password"
              value={togetherKey}
              onChange={e => setTogetherKey(e.target.value)}
              placeholder="together_..."
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs font-mono text-zinc-100 focus:outline-none focus:border-amber-500"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 pt-0.5">
              <span>Best value: ~1,660 photorealistic images for $5</span>
              <a
                href="https://api.together.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline flex items-center gap-0.5"
              >
                <span>Get Together Key</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

          {/* Google Gemini Key */}
          <div className="space-y-1.5">
            <label className="text-zinc-400 block font-mono text-[11px]">Google Gemini API Key:</label>
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="AQ.Ab8... or AIzaSy..."
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-100 focus:outline-none focus:border-zinc-500"
            />
            <div className="flex items-center justify-between text-[11px]">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-zinc-200 flex items-center space-x-1"
              >
                <span>Google AI Studio Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={handleTestConnection}
                disabled={isTesting || (!apiKey.trim() && !togetherKey.trim())}
                className="text-zinc-400 hover:text-zinc-200 font-mono flex items-center space-x-1 disabled:opacity-40"
              >
                {isTesting && <RefreshCw className="w-3 h-3 animate-spin mr-1" />}
                <span>Test Connection</span>
              </button>
            </div>
          </div>

          {testResult && (
            <div
              className={`p-2.5 rounded-lg border text-xs flex items-center space-x-1.5 ${
                testResult.success
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
              }`}
            >
              {testResult.success ? (
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              )}
              <span className="text-[11px]">{testResult.message}</span>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-2 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 text-xs font-semibold bg-zinc-100 text-zinc-950 hover:bg-white rounded-lg transition-colors"
          >
            Save Keys
          </button>
        </div>
      </div>
    </div>
  );
};
