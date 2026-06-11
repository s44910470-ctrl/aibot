'use client';

import { useMarketStore } from '@/store/market-store';

export function TrendStrengthWidget() {
  const analysis = useMarketStore((state) => state.analysis);
  const value = analysis?.trendStrengthScore ?? 0;

  return (
    <div className="rounded-3xl border border-border bg-panel/70 p-5 shadow-panel backdrop-blur-xl">
      <p className="text-sm text-muted">Trend Strength</p>
      <div className="mt-2 text-3xl font-bold">{value}</div>
      <div className="mt-3 h-2 rounded-full bg-white/10">
        <div className="h-full rounded-full bg-accent" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
