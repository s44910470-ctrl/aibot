'use client';

import { useMemo } from 'react';
import { useMarketStore } from '@/store/market-store';
import { detectSupportResistanceZones } from '@/lib/indicators/supportResistance';

export function SupportResistanceChart() {
  const snapshot = useMarketStore((state) => state.snapshot);

  const zones = useMemo(() => {
    if (!snapshot?.candles?.length) return [];
    return detectSupportResistanceZones(snapshot.candles, snapshot.symbol);
  }, [snapshot]);

  return (
    <div className="rounded-3xl border border-border bg-panel/70 p-5 shadow-panel backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Support / Resistance</h3>
          <p className="text-sm text-muted">Institutional reaction zones</p>
        </div>
      </div>

      <div className="space-y-3">
        {zones.map((zone) => (
          <div key={zone.id} className="rounded-2xl border border-border bg-panel p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm uppercase text-muted">{zone.type}</span>
              <span className="text-accent">{zone.confidence}%</span>
            </div>
            <div className="mt-2 text-xl font-semibold">${zone.price.toFixed(2)}</div>
            <div className="mt-2 text-sm text-muted">
              {zone.reason.join(' • ')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
