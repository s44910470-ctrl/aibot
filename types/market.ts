export type SymbolType = 'BTCUSDT' | 'ETHUSDT';

export interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketSnapshot {
  symbol: SymbolType;
  price: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  marketCap?: number;
  change24h: number;
  candles: Candle[];
}

export interface PriceZone {
  id: string;
  symbol: SymbolType;
  type: 'support' | 'resistance' | 'both';
  price: number;
  top: number;
  bottom: number;
  confidence: number;
  touches: number;
  lastTouchedAt?: number;
  reason: string[];
}
