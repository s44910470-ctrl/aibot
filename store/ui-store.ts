import { create } from 'zustand';

type ThemeMode = 'dark';

type UIState = {
  theme: ThemeMode;
  selectedSymbol: 'BTCUSDT' | 'ETHUSDT';
  selectedTimeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
  setSymbol: (symbol: UIState['selectedSymbol']) => void;
  setTimeframe: (timeframe: UIState['selectedTimeframe']) => void;
};

export const useUIStore = create<UIState>((set) => ({
  theme: 'dark',
  selectedSymbol: 'BTCUSDT',
  selectedTimeframe: '5m',
  setSymbol: (selectedSymbol) => set({ selectedSymbol }),
  setTimeframe: (selectedTimeframe) => set({ selectedTimeframe }),
}));
