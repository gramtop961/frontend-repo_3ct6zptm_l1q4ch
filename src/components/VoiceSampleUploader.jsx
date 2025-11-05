import React, { useEffect, useRef, useState } from 'react';
import { Mic, Square, Upload, Play, Pause, Download } from 'lucide-react';

const VoiceSampleUploader = ({ onSampleReady }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaSupported, setMediaSupported] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const audioRef = useRef(null);

  useEffect(() => {
    setMediaSupported(Boolean(navigator.mediaDevices && window.MediaRecorder));
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        onSampleReady && onSampleReady({ blob, url });
        setIsRecording(false);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Mic access error:', err);
      alert('Could not access microphone. Please allow mic permissions or upload a file.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const onFileSelect = (file) => {
    if (!file) return;
    if (!file.type.startsWith('audio/')) {
      alert('Please upload an audio file.');
      return;
    }
    const url = URL.createObjectURL(file);
    const blob = new Blob([file], { type: file.type });
    setAudioURL(url);
    onSampleReady && onSampleReady({ blob, url });
  };

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    onFileSelect(file);
  };

  const onDragOver = (e) => e.preventDefault();

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">1. Provide a voice sample</h2>
        <div className="text-xs text-white/60">Record ~5–15 seconds for best results</div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-white/10 p-4">
          <div className="mb-3 flex items-center gap-2 text-white/80">
            <Mic className="h-4 w-4" />
            <span className="text-sm">Microphone</span>
          </div>
          <div className="flex items-center gap-3">
            {!isRecording ? (
              <button onClick={startRecording} disabled={!mediaSupported} className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-500/40">
                <Mic className="h-4 w-4" /> Start recording
              </button>
            ) : (
              <button onClick={stopRecording} className="inline-flex items-center gap-2 rounded-md bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600">
                <Square className="h-4 w-4" /> Stop
              </button>
            )}
            {!mediaSupported && (
              <span className="text-xs text-amber-400">Recording not supported in this browser. Try uploading a file.</span>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-white/10 p-4">
          <div className="mb-3 flex items-center gap-2 text-white/80">
            <Upload className="h-4 w-4" />
            <span className="text-sm">Upload an audio file</span>
          </div>
          <label
            onDrop={onDrop}
            onDragOver={onDragOver}
            htmlFor="audio-upload"
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-white/15 p-6 text-center text-white/70 hover:border-white/25"
          >
            <input id="audio-upload" type="file" accept="audio/*" className="hidden" onChange={(e) => onFileSelect(e.target.files?.[0])} />
            <Upload className="h-6 w-6" />
            <span className="text-sm">Drag & drop audio here or click to browse</span>
          </label>
        </div>
      </div>

      {audioURL && (
        <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="mb-2 flex items-center justify-between text-sm text-white/80">
            <span className="inline-flex items-center gap-2">
              <Play className="h-4 w-4" /> Sample preview
            </span>
            <span>{duration ? `${duration.toFixed(1)}s` : ''}</span>
          </div>
          <audio ref={audioRef} src={audioURL} controls onLoadedMetadata={onLoadedMetadata} className="w-full" />
          <div className="mt-2 flex items-center gap-2">
            <a href={audioURL} download="voice-sample.webm" className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10">
              <Download className="h-3.5 w-3.5" /> Download sample
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceSampleUploader;
