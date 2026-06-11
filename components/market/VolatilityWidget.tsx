'use client';

import { useMarketStore } from '@/store/market-store';

export function VolatilityWidget() {
  const analysis = useMarketStore((state) => state.analysis);
  const value = analysis?.volatilityScore ?? 0;

  return (
    <div className="rounded-3xl border border-border bg-panel/70 p-5 shadow-panel backdrop-blur-xl">
      <p className="text-sm text-muted">Volatility Score</p>
      <div className="mt-2 text-3xl font-bold">{value}</div>
      <div className="mt-3 h-2 rounded-full bg-white/10">
        <div className="h-full rounded-full bg-warning" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
