'use client';

import { useMarketStore } from '@/store/market-store';

export function LivePriceCard() {
  const snapshot = useMarketStore((state) => state.snapshot);
  const status = useMarketStore((state) => state.connectionStatus);

  return (
    <div className="rounded-3xl border border-border bg-panel/70 p-5 shadow-panel backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted">Live Market</p>
          <h3 className="text-xl font-semibold">{snapshot?.symbol ?? 'BTCUSDT'}</h3>
        </div>
        <div className="text-xs text-accent">{status}</div>
      </div>

      <div className="mt-5 text-4xl font-bold">
        ${snapshot?.price?.toLocaleString() ?? '--'}
      </div>

      <div className="mt-3 text-sm text-muted">
        24h Change: {snapshot?.change24h?.toFixed(2) ?? '--'}%
      </div>
    </div>
  );
}
