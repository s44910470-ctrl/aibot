import { create } from 'zustand';
import type { Candle, MarketSnapshot, PriceZone } from '@/types/market';
import type { MarketAnalysis } from '@/types/analysis';

type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';

type MarketState = {
  loading: boolean;
  error: string | null;
  connectionStatus: ConnectionStatus;
  lastUpdatedAt: number | null;
  snapshot: MarketSnapshot | null;
  candles: Candle[];
  zones: PriceZone[];
  analysis: MarketAnalysis | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setLastUpdatedAt: (timestamp: number | null) => void;
  setSnapshot: (snapshot: MarketSnapshot | null) => void;
  setCandles: (candles: Candle[]) => void;
  setZones: (zones: PriceZone[]) => void;
  setAnalysis: (analysis: MarketAnalysis | null) => void;
};

export const useMarketStore = create<MarketState>((set) => ({
  loading: false,
  error: null,
  connectionStatus: 'idle',
  lastUpdatedAt: null,
  snapshot: null,
  candles: [],
  zones: [],
  analysis: null,
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setConnectionStatus: (connectionStatus) => set({ connectionStatus }),
  setLastUpdatedAt: (lastUpdatedAt) => set({ lastUpdatedAt }),
  setSnapshot: (snapshot) => set({ snapshot }),
  setCandles: (candles) => set({ candles }),
  setZones: (zones) => set({ zones }),
  setAnalysis: (analysis) => set({ analysis }),
}));
