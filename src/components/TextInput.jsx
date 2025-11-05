import React from 'react';

const TextInput = ({ value, onChange, maxLength = 500 }) => {
  const remaining = maxLength - value.length;
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">2. Enter text to speak</h2>
        <div className="text-xs text-white/60">{remaining} chars left</div>
      </div>
      <textarea
        value={value}
        onChange={(e) => {
          if (e.target.value.length <= maxLength) onChange(e.target.value);
        }}
        placeholder="Type what you want the cloned voice to say..."
        className="min-h-[120px] w-full resize-none rounded-md border border-white/10 bg-white/5 p-4 text-white placeholder:text-white/40 focus:border-emerald-500 focus:outline-none"
      />
    </div>
  );
};

export default TextInput;
