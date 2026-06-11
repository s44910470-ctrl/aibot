'use client';

import { useMarketStore } from '@/store/market-store';

export function AIInsightPanel() {
  const analysis = useMarketStore((state) => state.analysis);

  return (
    <div className="rounded-3xl border border-border bg-panel/70 p-5 shadow-panel backdrop-blur-xl">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">AI Market Insight</h3>
        <p className="text-sm text-muted">Institutional scoring layer</p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl border border-border bg-panel p-3">
          Bullish: {analysis?.bullishScore ?? '--'}
        </div>
        <div className="rounded-2xl border border-border bg-panel p-3">
          Bearish: {analysis?.bearishScore ?? '--'}
        </div>
        <div className="rounded-2xl border border-border bg-panel p-3">
          Momentum: {analysis?.momentumScore ?? '--'}
        </div>
        <div className="rounded-2xl border border-border bg-panel p-3">
          Confidence: {analysis?.confidenceScore ?? '--'}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-panel p-4 text-sm text-muted">
        {analysis?.summary ?? 'Waiting for analysis...'}
      </div>
    </div>
  );
}
