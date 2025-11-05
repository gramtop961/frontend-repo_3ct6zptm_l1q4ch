import React, { useEffect, useMemo, useState } from 'react';
import { Play, Pause, Settings, Rocket } from 'lucide-react';

const SynthesisControls = ({ text, sample }) => {
  const [voices, setVoices] = useState([]);
  const [voiceIndex, setVoiceIndex] = useState(0);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [speaking, setSpeaking] = useState(false);

  const [cloning, setCloning] = useState(false);
  const [clonedUrl, setClonedUrl] = useState('');
  const [error, setError] = useState('');

  const loadVoices = () => {
    const v = window.speechSynthesis?.getVoices?.() || [];
    setVoices(v);
  };

  useEffect(() => {
    loadVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const selectedVoice = useMemo(() => (voices[voiceIndex] ? voices[voiceIndex] : null), [voices, voiceIndex]);

  const speak = () => {
    if (!text.trim()) return;
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = rate;
    utter.pitch = pitch;
    if (selectedVoice) utter.voice = selectedVoice;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  const stop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  };

  const cloneOnServer = async () => {
    setError('');
    setClonedUrl('');
    try {
      if (!text.trim()) return;
      if (!sample?.blob) {
        setError('Please record or upload a voice sample first.');
        return;
      }
      setCloning(true);
      const form = new FormData();
      form.append('text', text);
      form.append('sample', sample.blob, 'sample.webm');

      const base = import.meta.env.VITE_BACKEND_URL || `${window.location.protocol}//${window.location.hostname}:8000`;
      const res = await fetch(`${base}/clone`, {
        method: 'POST',
        body: form,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to clone voice');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setClonedUrl(url);
    } catch (e) {
      setError(e.message || 'Unexpected error');
    } finally {
      setCloning(false);
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">3. Preview speech (demo)</h2>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">
          <Settings className="h-3.5 w-3.5" /> TTS Controls
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-1">
          <label className="mb-1 block text-xs text-white/70">Voice</label>
          <select
            value={voiceIndex}
            onChange={(e) => setVoiceIndex(Number(e.target.value))}
            className="w-full rounded-md border border-white/10 bg-white/5 p-2 text-white focus:border-emerald-500 focus:outline-none"
          >
            {voices.length === 0 ? (
              <option>System default</option>
            ) : (
              voices.map((v, i) => (
                <option key={v.name + i} value={i}>
                  {v.name} {v.lang ? `(${v.lang})` : ''}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="sm:col-span-1">
          <label className="mb-1 block text-xs text-white/70">Rate: {rate.toFixed(2)}</label>
          <input
            type="range"
            min="0.5"
            max="1.75"
            step="0.05"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="sm:col-span-1">
          <label className="mb-1 block text-xs text-white/70">Pitch: {pitch.toFixed(2)}</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.05"
            value={pitch}
            onChange={(e) => setPitch(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={speak}
          disabled={!text.trim()}
          className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-500/40"
        >
          <Play className="h-4 w-4" /> Speak preview
        </button>
        <button
          onClick={stop}
          className="inline-flex items-center gap-2 rounded-md border border-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
        >
          <Pause className="h-4 w-4" /> Stop
        </button>

        <div className="ml-auto" />

        <button
          onClick={cloneOnServer}
          disabled={!text.trim() || !sample?.blob || cloning}
          className="inline-flex items-center gap-2 rounded-md bg-fuchsia-500 px-4 py-2 text-sm font-medium text-white hover:bg-fuchsia-600 disabled:cursor-not-allowed disabled:bg-fuchsia-500/40"
        >
          <Rocket className="h-4 w-4" /> {cloning ? 'Cloning…' : 'Publish & Clone'}
        </button>
      </div>

      {error && (
        <div className="mt-3 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>
      )}

      {clonedUrl && (
        <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="mb-2 text-sm text-white/80">Cloned result</div>
          <audio src={clonedUrl} controls className="w-full" />
          <div className="mt-2 text-xs text-white/60">Note: For demo purposes, this uses a server TTS engine rather than true voice cloning.</div>
        </div>
      )}
    </div>
  );
};

export default SynthesisControls;
