'use client';

import { useEffect } from 'react';
import { useMarketStore } from '@/store/market-store';
import { BinanceSocketManager } from '@/lib/market/websocket';

const socketManager = new BinanceSocketManager();

export function useMarketStream(symbols: string[]) {
  const setLastUpdatedAt = useMarketStore((state) => state.setLastUpdatedAt);
  const setConnectionStatus = useMarketStore((state) => state.setConnectionStatus);
  const setError = useMarketStore((state) => state.setError);

  useEffect(() => {
    if (!symbols.length) return;

    setConnectionStatus('connecting');
    setError(null);

    socketManager.connect(symbols, (update) => {
      const store = useMarketStore.getState();
      setLastUpdatedAt(update.timestamp);

      const current = store.snapshot;
      if (current && current.symbol === update.symbol) {
        store.setSnapshot({
          ...current,
          price: update.price,
        });
      }

      store.setConnectionStatus('connected');
    });

    return () => {
      socketManager.disconnect();
      setConnectionStatus('disconnected');
    };
  }, [symbols.join(','), setConnectionStatus, setError, setLastUpdatedAt]);
}
