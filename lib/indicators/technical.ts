import type { Candle } from '@/types/market';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function sma(values: number[], period: number) {
  if (values.length < period || period <= 0) return 0;
  const slice = values.slice(-period);
  return slice.reduce((sum, value) => sum + value, 0) / period;
}

export function ema(values: number[], period: number) {
  if (!values.length || period <= 0) return 0;
  const k = 2 / (period + 1);
  let result = values[0];
  for (let i = 1; i < values.length; i += 1) {
    result = values[i] * k + result * (1 - k);
  }
  return result;
}

export function rsi(values: number[], period = 14) {
  if (values.length <= period) return 50;
  let gains = 0;
  let losses = 0;
  for (let i = values.length - period; i < values.length; i += 1) {
    const change = values[i] - values[i - 1];
    if (change >= 0) gains += change;
    else losses -= change;
  }
  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return clamp(100 - 100 / (1 + rs), 0, 100);
}

export function atr(candles: Candle[], period = 14) {
  if (candles.length <= period) return 0;
  const trs: number[] = [];
  for (let i = 1; i < candles.length; i += 1) {
    const current = candles[i];
    const prev = candles[i - 1];
    const tr = Math.max(
      current.high - current.low,
      Math.abs(current.high - prev.close),
      Math.abs(current.low - prev.close),
    );
    trs.push(tr);
  }
  return sma(trs, period);
}

export function macd(values: number[]) {
  const fast = ema(values.slice(-26), 12);
  const slow = ema(values.slice(-26), 26);
  const line = fast - slow;
  const signalBase = [...values.slice(-26), line];
  const signal = ema(signalBase, 9);
  return { line, signal, histogram: line - signal };
}

export function trendSlope(values: number[], lookback = 20) {
  if (values.length < lookback) return 0;
  const slice = values.slice(-lookback);
  const xMean = (lookback - 1) / 2;
  const yMean = sma(slice, lookback);
  let numerator = 0;
  let denominator = 0;
  slice.forEach((y, x) => {
    numerator += (x - xMean) * (y - yMean);
    denominator += (x - xMean) ** 2;
  });
  return denominator === 0 ? 0 : numerator / denominator;
}

export function candleBodyStrength(candle: Candle) {
  const range = candle.high - candle.low;
  if (range <= 0) return 0;
  return clamp(Math.abs(candle.close - candle.open) / range, 0, 1);
}

export function volatilityCompression(candles: Candle[], lookback = 20) {
  if (candles.length < lookback + 1) return 0;
  const ranges = candles.slice(-lookback).map((c) => c.high - c.low);
  const current = sma(ranges.slice(-5), 5);
  const baseline = sma(ranges, lookback);
  if (baseline === 0) return 0;
  return clamp(1 - current / baseline, 0, 1);
}

export function volumeExpansion(candles: Candle[], lookback = 20) {
  if (candles.length < lookback + 1) return 0;
  const volumes = candles.map((c) => c.volume);
  const current = sma(volumes.slice(-5), 5);
  const baseline = sma(volumes.slice(-lookback), lookback);
  if (baseline === 0) return 0;
  return clamp(current / baseline, 0, 3);
}

export function proximityToLevel(price: number, level: number) {
  if (!price || !level) return 0;
  const distance = Math.abs(price - level) / price;
  return clamp(1 - distance / 0.02, 0, 1);
}
