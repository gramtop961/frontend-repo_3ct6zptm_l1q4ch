import React, { useState } from 'react';
import SplineHero from './components/SplineHero';
import VoiceSampleUploader from './components/VoiceSampleUploader';
import TextInput from './components/TextInput';
import SynthesisControls from './components/SynthesisControls';

function App() {
  const [sample, setSample] = useState(null); // { blob, url }
  const [text, setText] = useState('Hello there! This is a demo of the voice lab.');

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <SplineHero />

        <div className="grid grid-cols-1 gap-6">
          <VoiceSampleUploader onSampleReady={setSample} />
          <TextInput value={text} onChange={setText} />
          <SynthesisControls text={text} sample={sample} />
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-900/60 p-5 text-sm text-white/70">
          <h3 className="mb-2 text-base font-medium text-white">How this demo works</h3>
          <ul className="list-disc space-y-1 pl-5">
            <li>Record or upload an audio sample. You can preview or download it locally.</li>
            <li>Enter any text and use the Preview button to hear it via your browser's speech engine.</li>
            <li>Use Publish & Clone to send your sample and text to the server and get an audio file back.</li>
          </ul>
          {sample?.url && (
            <div className="mt-3 text-xs text-white/60">Sample captured. Size: {Math.round((sample.blob?.size || 0) / 1024)} KB</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
