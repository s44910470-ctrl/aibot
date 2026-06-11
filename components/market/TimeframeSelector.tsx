'use client';

import { useUIStore } from '@/store/ui-store';

const timeframes = ['1m', '5m', '15m', '1h', '4h', '1d'] as const;

export function TimeframeSelector() {
  const selectedTimeframe = useUIStore((s) => s.selectedTimeframe);
  const setTimeframe = useUIStore((s) => s.setTimeframe);

  return (
    <div className="flex flex-wrap gap-2">
      {timeframes.map((timeframe) => (
        <button
          key={timeframe}
          onClick={() => setTimeframe(timeframe)}
          className={`rounded-xl border px-4 py-2 text-sm transition ${
            selectedTimeframe === timeframe
              ? 'border-accent bg-accent/10 text-accent'
              : 'border-border bg-panel text-muted'
          }`}
        >
          {timeframe}
        </button>
      ))}
    </div>
  );
}
