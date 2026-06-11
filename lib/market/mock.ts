import type { Candle, MarketSnapshot, SymbolType } from '@/types/market';

const basePrices: Record<SymbolType, number> = {
  BTCUSDT: 67500,
  ETHUSDT: 3450,
};

function buildCandles(base: number, count = 120): Candle[] {
  const candles: Candle[] = [];
  let lastClose = base;
  const now = Date.now();

  for (let i = count - 1; i >= 0; i -= 1) {
    const timestamp = now - i * 60_000;
    const drift = Math.sin(i / 8) * base * 0.002;
    const open = lastClose;
    const close = Math.max(1, open + drift + (Math.random() - 0.5) * base * 0.004);
    const high = Math.max(open, close) + base * (0.001 + Math.random() * 0.002);
    const low = Math.min(open, close) - base * (0.001 + Math.random() * 0.002);
    const volume = 1200 + Math.random() * 6000;
    candles.push({ timestamp, open, high, low, close, volume });
    lastClose = close;
  }

  return candles;
}

export function getMockMarketSnapshot(symbol: SymbolType): MarketSnapshot {
  const price = basePrices[symbol] * (1 + (Math.random() - 0.5) * 0.01);
  const candles = buildCandles(price);
  const high24h = Math.max(...candles.map((c) => c.high));
  const low24h = Math.min(...candles.map((c) => c.low));
  const volume24h = candles.reduce((sum, c) => sum + c.volume, 0);

  return {
    symbol,
    price,
    high24h,
    low24h,
    volume24h,
    marketCap: symbol === 'BTCUSDT' ? 1.3e12 : 4.1e11,
    change24h: (Math.random() - 0.5) * 6,
    candles,
  };
}
