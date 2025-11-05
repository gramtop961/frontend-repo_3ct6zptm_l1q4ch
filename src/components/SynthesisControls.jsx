import React, { useEffect, useMemo, useState } from 'react';
import { Play, Pause, Settings } from 'lucide-react';

const SynthesisControls = ({ text }) => {
  const [voices, setVoices] = useState([]);
  const [voiceIndex, setVoiceIndex] = useState(0);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [speaking, setSpeaking] = useState(false);

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
        <span className="text-xs text-white/60">
          Note: This uses your browser's speech engine for preview. Real voice cloning will use the uploaded sample on the server.
        </span>
      </div>
    </div>
  );
};

export default SynthesisControls;
