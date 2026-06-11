import type { Candle, PriceZone } from '@/types/market';
import type { MarketAnalysis } from '@/types/analysis';
import {
  atr,
  candleBodyStrength,
  macd,
  proximityToLevel,
  rsi,
  trendSlope,
  volatilityCompression,
  volumeExpansion,
} from '@/lib/indicators/technical';

const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));

export function analyzeMarket(candles: Candle[], zones: PriceZone[]): MarketAnalysis {
  const closes = candles.map((c) => c.close);
  const last = candles[candles.length - 1];
  const resistance = zones.find((z) => z.type === 'resistance');
  const support = zones.find((z) => z.type === 'support');

  const rsiValue = rsi(closes);
  const atrValue = atr(candles);
  const macdValue = macd(closes);
  const slope = trendSlope(closes);
  const compression = volatilityCompression(candles);
  const volumeBoost = volumeExpansion(candles);
  const bodyStrength = candleBodyStrength(last);

  const breakoutRaw =
    compression * 20 +
    Math.min(volumeBoost, 2) * 15 +
    Math.max(slope, 0) * 8 +
    bodyStrength * 20 +
    proximityToLevel(last.close, resistance?.price ?? last.close) * 20 +
    (rsiValue > 55 ? 10 : 0) +
    (macdValue.histogram > 0 ? 7 : 0);

  const trendStrength = clamp(Math.abs(slope) * 30 + Math.abs(macdValue.histogram) * 12 + bodyStrength * 30);
  const volatilityScore = clamp((atrValue / Math.max(last.close, 1)) * 1000);
  const momentumScore = clamp((rsiValue - 50) * 1.8 + macdValue.histogram * 10 + slope * 10 + 50);

  const bullishScore = clamp(momentumScore + (macdValue.histogram > 0 ? 10 : 0));
  const bearishScore = clamp(100 - bullishScore + (rsiValue < 45 ? 10 : 0));
  const breakoutScore = clamp(breakoutRaw);
  const fakeoutRiskScore = clamp(100 - bodyStrength * 50 - volumeBoost * 20 + compression * 10);
  const confidenceScore = clamp((trendStrength + breakoutScore + Math.min(volumeBoost * 20, 20)) / 2.5);

  const reasons = [
    `RSI ${rsiValue.toFixed(1)}`,
    `MACD histogram ${macdValue.histogram.toFixed(2)}`,
    `Volume ${volumeBoost.toFixed(2)}x baseline`,
    `Compression ${(compression * 100).toFixed(0)}%`,
  ];

  const summary = breakoutScore > 70
    ? 'High breakout potential with supportive momentum.'
    : breakoutScore > 45
      ? 'Balanced market structure with moderate breakout probability.'
      : 'Low conviction structure; breakout conditions are weak.';

  return {
    bullishScore,
    bearishScore,
    breakoutScore,
    fakeoutRiskScore,
    confidenceScore,
    trendStrengthScore: trendStrength,
    volatilityScore,
    momentumScore,
    summary,
    reasons,
  };
}
