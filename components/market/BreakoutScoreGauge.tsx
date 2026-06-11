'use client';

import { useMarketStore } from '@/store/market-store';

export function BreakoutScoreGauge() {
  const analysis = useMarketStore((state) => state.analysis);
  const score = analysis?.breakoutScore ?? 0;

  return (
    <div className="rounded-3xl border border-border bg-panel/70 p-5 shadow-panel backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Breakout Probability</h3>
          <p className="text-sm text-muted">Technical breakout score</p>
        </div>
        <div className="text-3xl font-bold text-accent">{score}%</div>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}
