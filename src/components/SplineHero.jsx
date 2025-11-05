import React from 'react';
import Spline from '@splinetool/react-spline';

const SplineHero = () => {
  return (
    <section className="relative h-[60vh] w-full overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/4f5y1nHUlsnOMi4t/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-900/30 via-slate-900/60 to-slate-950" />
      <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-6 text-center">
        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Voice Lab Demo
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
          Clone a voice from a short sample
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-white/80 sm:text-base">
          Record or upload a few seconds of audio, type any text, and preview with in-browser speech. Real cloning will connect to a server model in the next step.
        </p>
      </div>
    </section>
  );
};

export default SplineHero;
