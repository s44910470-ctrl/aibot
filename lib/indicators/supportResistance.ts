import type { Candle, PriceZone, SymbolType } from '@/types/market';

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function percentile(values: number[], percent: number) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.round((percent / 100) * (sorted.length - 1))));
  return sorted[index];
}

function clusterLevels(levels: number[], tolerancePct = 0.003) {
  const clusters: number[][] = [];
  const sorted = [...levels].sort((a, b) => a - b);

  for (const level of sorted) {
    const cluster = clusters[clusters.length - 1];
    if (!cluster) {
      clusters.push([level]);
      continue;
    }

    const clusterMean = average(cluster);
    const tolerance = clusterMean * tolerancePct;
    if (Math.abs(level - clusterMean) <= tolerance) {
      cluster.push(level);
    } else {
      clusters.push([level]);
    }
  }

  return clusters;
}

export function detectSupportResistanceZones(candles: Candle[], symbol: SymbolType): PriceZone[] {
  if (candles.length < 10) return [];

  const pivotWindow = 3;
  const swingHighs: number[] = [];
  const swingLows: number[] = [];
  const closes = candles.map((c) => c.close);
  const volumes = candles.map((c) => c.volume);

  for (let i = pivotWindow; i < candles.length - pivotWindow; i += 1) {
    const current = candles[i];
    const prev = candles.slice(i - pivotWindow, i);
    const next = candles.slice(i + 1, i + pivotWindow + 1);

    const isHigh = prev.every((c) => current.high >= c.high) && next.every((c) => current.high >= c.high);
    const isLow = prev.every((c) => current.low <= c.low) && next.every((c) => current.low <= c.low);

    if (isHigh) swingHighs.push(current.high);
    if (isLow) swingLows.push(current.low);
  }

  const roundedLevels = candles.flatMap((c) => [
    Math.round(c.high / 50) * 50,
    Math.round(c.low / 50) * 50,
  ]);

  const supports = clusterLevels([...swingLows, percentile(closes, 15), ...roundedLevels.slice(0, 10)]);
  const resistances = clusterLevels([...swingHighs, percentile(closes, 85), ...roundedLevels.slice(-10)]);
  const currentPrice = closes[closes.length - 1];
  const avgVolume = average(volumes);
  const recentVolume = average(volumes.slice(-10));
  const volumeBoost = avgVolume === 0 ? 0 : recentVolume / avgVolume;

  const buildZone = (cluster: number[], type: 'support' | 'resistance') => {
    const price = average(cluster);
    const touches = candles.filter((c) => {
      const proximity = price * 0.004;
      return type === 'support'
        ? Math.abs(c.low - price) <= proximity || Math.abs(c.close - price) <= proximity
        : Math.abs(c.high - price) <= proximity || Math.abs(c.close - price) <= proximity;
    }).length;

    const distanceFromPrice = Math.abs(currentPrice - price) / currentPrice;
    const recencyBias = candles.slice(-20).some((c) =>
      type === 'support' ? Math.abs(c.low - price) <= price * 0.003 : Math.abs(c.high - price) <= price * 0.003,
    )
      ? 1.15
      : 1;

    const confidence = Math.min(
      100,
      Math.round(
        ((touches * 12) + (volumeBoost * 10) + ((1 - distanceFromPrice) * 30) + (recencyBias * 10)),
      ),
    );

    return {
      id: `${symbol}-${type}-${price.toFixed(2)}`,
      symbol,
      type,
      price,
      top: price * 1.004,
      bottom: price * 0.996,
      confidence,
      touches,
      reason: [
        `${touches} touches detected`,
        `recent volume ratio ${volumeBoost.toFixed(2)}x`,
        `${type === 'support' ? 'below' : 'above'} price structure`,
      ],
    } satisfies PriceZone;
  };

  return [
    ...supports.slice(-3).map((cluster) => buildZone(cluster, 'support')),
    ...resistances.slice(0, 3).map((cluster) => buildZone(cluster, 'resistance')),
  ].sort((a, b) => b.confidence - a.confidence);
}
