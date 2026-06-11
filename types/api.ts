import type { Candle, MarketSnapshot, PriceZone } from './market';
import type { MarketAnalysis } from './analysis';

export interface ApiResponse<T> {
  ok: boolean;
  data: T;
  error?: string;
}

export interface MarketApiData {
  snapshot: MarketSnapshot;
  zones: PriceZone[];
  analysis: MarketAnalysis;
  candles: Candle[];
}
