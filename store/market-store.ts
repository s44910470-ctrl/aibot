import { create } from 'zustand';
import type { Candle, MarketSnapshot, PriceZone } from '@/types/market';
import type { MarketAnalysis } from '@/types/analysis';

type MarketState = {
  loading: boolean;
  error: string | null;
  snapshot: MarketSnapshot | null;
  candles: Candle[];
  zones: PriceZone[];
  analysis: MarketAnalysis | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSnapshot: (snapshot: MarketSnapshot | null) => void;
  setCandles: (candles: Candle[]) => void;
  setZones: (zones: PriceZone[]) => void;
  setAnalysis: (analysis: MarketAnalysis | null) => void;
};

export const useMarketStore = create<MarketState>((set) => ({
  loading: false,
  error: null,
  snapshot: null,
  candles: [],
  zones: [],
  analysis: null,
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSnapshot: (snapshot) => set({ snapshot }),
  setCandles: (candles) => set({ candles }),
  setZones: (zones) => set({ zones }),
  setAnalysis: (analysis) => set({ analysis }),
}));
