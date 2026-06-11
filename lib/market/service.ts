import type { MarketSnapshot, SymbolType } from '@/types/market';
import { getCache, setCache } from './cache';
import { fetchBinanceSnapshot } from './binance';
import { getMockMarketSnapshot } from './mock';

const MARKET_TTL_MS = 10_000;
const CANDLES_TTL_MS = 10_000;

export async function getMarketSnapshot(symbol: SymbolType, timeframe = '5m'): Promise<MarketSnapshot> {
  const cacheKey = `market:${symbol}:${timeframe}`;
  const cached = getCache<MarketSnapshot>(cacheKey);
  if (cached) return cached;

  try {
    const live = await fetchBinanceSnapshot(symbol, timeframe);
    setCache(cacheKey, live, MARKET_TTL_MS);
    return live;
  } catch {
    const fallback = getMockMarketSnapshot(symbol);
    setCache(cacheKey, fallback, MARKET_TTL_MS);
    return fallback;
  }
}

export async function getCandleSeries(symbol: SymbolType, timeframe = '5m') {
  const cacheKey = `candles:${symbol}:${timeframe}`;
  const cached = getCache<MarketSnapshot>(cacheKey);
  if (cached) return cached.candles;

  const snapshot = await getMarketSnapshot(symbol, timeframe);
  setCache(cacheKey, snapshot, CANDLES_TTL_MS);
  return snapshot.candles;
}
