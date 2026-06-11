'use client';

import { useMemo, useState } from 'react';
import type { Candle, PriceZone } from '@/types/market';
import { useMarketStore } from '@/store/market-store';

function scale(value: number, min: number, max: number, height: number, padding = 24) {
  if (max === min) return height / 2;
  return height - padding - ((value - min) / (max - min)) * (height - padding * 2);
}

export function CandlestickChart() {
  const snapshot = useMarketStore((state) => state.snapshot);
  const zones = useMarketStore((state) => state.zones) as PriceZone[];
  const [visibleCount, setVisibleCount] = useState(40);

  const candles = snapshot?.candles ?? [];
  const visibleCandles = candles.slice(-visibleCount);

  const { minPrice, maxPrice, maxVolume } = useMemo(() => {
    const priceValues = visibleCandles.flatMap((c) => [c.high, c.low]);
    return {
      minPrice: priceValues.length ? Math.min(...priceValues) : 0,
      maxPrice: priceValues.length ? Math.max(...priceValues) : 1,
      maxVolume: visibleCandles.length ? Math.max(...visibleCandles.map((c) => c.volume)) : 1,
    };
  }, [visibleCandles]);

  const width = 900;
  const height = 420;
  const volumeHeight = 90;
  const chartHeight = height - volumeHeight;
  const candleGap = 4;
  const candleWidth = Math.max(4, (width - 80) / Math.max(1, visibleCandles.length) - candleGap);

  return (
    <div className="rounded-3xl border border-border bg-panel/70 p-5 shadow-panel backdrop-blur-xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Realtime Market Chart</h3>
          <p className="text-sm text-muted">Candles, volume, and key zones</p>
        </div>

        <div className="flex gap-2">
          {[20, 40, 60, 100].map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => setVisibleCount(count)}
              className={`rounded-xl border px-3 py-2 text-xs transition ${
                visibleCount === count ? 'border-accent bg-accent/10 text-accent' : 'border-border bg-panel text-muted'
              }`}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[900px] w-full">
          {Array.from({ length: 5 }).map((_, i) => {
            const y = 24 + ((chartHeight - 48) / 4) * i;
            return <line key={i} x1="40" x2={width - 20} y1={y} y2={y} stroke="rgba(255,255,255,0.08)" />;
          })}

          {zones.map((zone) => {
            const y = scale(zone.price, minPrice, maxPrice, chartHeight, 24);
            return (
              <g key={zone.id}>
                <line x1="40" x2={width - 20} y1={y} y2={y} stroke="rgba(0,255,209,0.4)" strokeDasharray="6 4" />
                <text x="44" y={y - 4} fill="rgba(255,255,255,0.7)" fontSize="10">
                  {zone.type.toUpperCase()} {zone.price.toFixed(2)}
                </text>
              </g>
            );
          })}

          {visibleCandles.map((candle, index) => {
            const x = 50 + index * ((width - 80) / Math.max(1, visibleCandles.length));
            const openY = scale(candle.open, minPrice, maxPrice, chartHeight, 24);
            const closeY = scale(candle.close, minPrice, maxPrice, chartHeight, 24);
            const highY = scale(candle.high, minPrice, maxPrice, chartHeight, 24);
            const lowY = scale(candle.low, minPrice, maxPrice, chartHeight, 24);
            const bullish = candle.close >= candle.open;
            const bodyTop = Math.min(openY, closeY);
            const bodyHeight = Math.max(2, Math.abs(closeY - openY));
            const volumeBarHeight = (candle.volume / maxVolume) * (volumeHeight - 20);
            const volumeY = height - volumeBarHeight - 8;

            return (
              <g key={candle.timestamp}>
                <line x1={x} x2={x} y1={highY} y2={lowY} stroke={bullish ? 'rgba(0,255,209,0.8)' : 'rgba(255,90,90,0.8)'} strokeWidth="1.2" />
                <rect
                  x={x - candleWidth / 2}
                  y={bodyTop}
                  width={candleWidth}
                  height={bodyHeight}
                  rx="2"
                  fill={bullish ? 'rgba(0,255,209,0.8)' : 'rgba(255,90,90,0.8)'}
                />
                <rect
                  x={x - candleWidth / 2}
                  y={volumeY}
                  width={candleWidth}
                  height={volumeBarHeight}
                  rx="2"
                  fill="rgba(255,255,255,0.12)"
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
