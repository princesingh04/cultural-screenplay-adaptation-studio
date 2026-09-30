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
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gemini_api_key') || '';
      setApiKey(stored);
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
    }
    onApiKeySaved(apiKey.trim());
    onClose();
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setTestResult({ success: false, message: 'Please enter an API key to test' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
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
        setTestResult({ success: true, message: 'Connection successful! Gemini 2.5 Flash is active.' });
      } else if (data.error) {
        setTestResult({ success: false, message: data.error });
      } else {
        setTestResult({ success: false, message: 'Could not verify key. Check permissions.' });
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
          Optionally connect your **Google Gemini API Key** to enable live AI screenplay adaptation and dynamic Imagen visual generation.
          The key is stored privately in your browser session or in <code className="font-mono text-zinc-300">.env.local</code>.
        </p>

        <div className="space-y-3">
          <div>
            <label className="text-zinc-400 block mb-1 font-mono text-[11px]">Google Gemini API Key:</label>
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-100 focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-zinc-200 flex items-center space-x-1"
            >
              <span>Get a free key from Google AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={handleTestConnection}
              disabled={isTesting || !apiKey.trim()}
              className="text-zinc-400 hover:text-zinc-200 font-mono flex items-center space-x-1 disabled:opacity-40"
            >
              {isTesting && <RefreshCw className="w-3 h-3 animate-spin mr-1" />}
              <span>Test Key</span>
            </button>
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
            Save Key
          </button>
        </div>
      </div>
    </div>
  );
};
