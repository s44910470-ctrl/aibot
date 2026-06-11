'use client';

import { useEffect } from 'react';
import { useMarketStore } from '@/store/market-store';
import { BinanceSocketManager } from '@/lib/market/websocket';

const socketManager = new BinanceSocketManager();

export function useMarketStream(symbols: string[]) {
  const setSnapshot = useMarketStore((state) => state.setSnapshot);
  const setLastUpdatedAt = useMarketStore((state) => state.setLastUpdatedAt);
  const setConnectionStatus = useMarketStore((state) => state.setConnectionStatus);
  const setError = useMarketStore((state) => state.setError);

  useEffect(() => {
    if (!symbols.length) return;

    setConnectionStatus('connecting');
    setError(null);

    socketManager.connect(symbols, (update) => {
      setLastUpdatedAt(update.timestamp);
      setSnapshot((prev) =>
        prev && prev.symbol === update.symbol
          ? {
              ...prev,
              price: update.price,
            }
          : prev,
      );
      setConnectionStatus('connected');
    });

    return () => {
      socketManager.disconnect();
      setConnectionStatus('disconnected');
    };
  }, [symbols.join(','), setConnectionStatus, setError, setLastUpdatedAt, setSnapshot]);
}
