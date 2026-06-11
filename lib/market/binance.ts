import type { Candle, MarketSnapshot, SymbolType } from '@/types/market';

const BINANCE_BASE = 'https://api.binance.com/api/v3';

function toSymbol(symbol: SymbolType) {
  return symbol;
}

function timeframeToInterval(timeframe: string) {
  switch (timeframe) {
    case '1m':
    case '5m':
    case '15m':
    case '1h':
    case '4h':
    case '1d':
      return timeframe;
    default:
      return '5m';
  }
}

export async function fetchBinanceSnapshot(symbol: SymbolType, timeframe = '5m'): Promise<MarketSnapshot> {
  const interval = timeframeToInterval(timeframe);
  const [tickerRes, klinesRes] = await Promise.all([
    fetch(`${BINANCE_BASE}/ticker/24hr?symbol=${toSymbol(symbol)}`),
    fetch(`${BINANCE_BASE}/klines?symbol=${toSymbol(symbol)}&interval=${interval}&limit=120`),
  ]);

  if (!tickerRes.ok || !klinesRes.ok) {
    throw new Error('Binance market request failed');
  }

  const ticker = await tickerRes.json();
  const klines: unknown[] = await klinesRes.json();

  const candles: Candle[] = klines.map((row) => {
    const [openTime, open, high, low, close, volume] = row as [number, string, string, string, string, string];
    return {
      timestamp: openTime,
      open: Number(open),
      high: Number(high),
      low: Number(low),
      close: Number(close),
      volume: Number(volume),
    };
  });

  const last = candles[candles.length - 1];
  const price = Number(ticker.lastPrice ?? last?.close ?? 0);

  return {
    symbol,
    price,
    high24h: Number(ticker.highPrice ?? price),
    low24h: Number(ticker.lowPrice ?? price),
    volume24h: Number(ticker.volume ?? 0),
    change24h: Number(ticker.priceChangePercent ?? 0),
    marketCap: undefined,
    candles,
  };
}
