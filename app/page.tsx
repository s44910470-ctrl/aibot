'use client';

import { useEffect } from 'react';
import { LivePriceCard } from '@/components/market/LivePriceCard';
import { TimeframeSelector } from '@/components/market/TimeframeSelector';
import { CandlestickChart } from '@/components/charts/CandlestickChart';
import { SupportResistanceChart } from '@/components/market/SupportResistanceChart';
import { useUIStore } from '@/store/ui-store';
import { useMarketStore } from '@/store/market-store';
import { useMarketStream } from '@/hooks/useMarketStream';
import type { MarketApiData } from '@/types/api';
import { detectSupportResistanceZones } from '@/lib/indicators/supportResistance';

function DashboardLoading() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="h-36 animate-pulse rounded-3xl border border-border bg-panel/50" />
      <div className="h-36 animate-pulse rounded-3xl border border-border bg-panel/50" />
      <div className="lg:col-span-2 h-[480px] animate-pulse rounded-3xl border border-border bg-panel/50" />
    </div>
  );
}

export default function HomePage() {
  const symbol = useUIStore((state) => state.selectedSymbol);
  const timeframe = useUIStore((state) => state.selectedTimeframe);
  const loading = useMarketStore((state) => state.loading);
  const error = useMarketStore((state) => state.error);
  const setLoading = useMarketStore((state) => state.setLoading);
  const setError = useMarketStore((state) => state.setError);
  const setSnapshot = useMarketStore((state) => state.setSnapshot);
  const setCandles = useMarketStore((state) => state.setCandles);
  const setZones = useMarketStore((state) => state.setZones);
  const setAnalysis = useMarketStore((state) => state.setAnalysis);

  useMarketStream([symbol]);

  useEffect(() => {
    let mounted = true;

    async function loadMarket() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/market?symbol=${symbol}&timeframe=${timeframe}`);
        const json = (await response.json()) as { ok: boolean; data?: MarketApiData; error?: string };

        if (!response.ok || !json.ok || !json.data) {
          throw new Error(json.error ?? 'Market load failed');
        }

        if (!mounted) return;

        const { snapshot, candles, analysis } = json.data;
        const zones = detectSupportResistanceZones(candles, snapshot.symbol);

        setSnapshot(snapshot);
        setCandles(candles);
        setZones(zones);
        setAnalysis(analysis);
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load market data');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadMarket();

    return () => {
      mounted = false;
    };
  }, [symbol, timeframe, setAnalysis, setCandles, setError, setLoading, setSnapshot, setZones]);

  return (
    <main className="min-h-screen bg-bg text-text">
      <section className="mx-auto max-w-7xl px-6 py-8 lg:py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-panel/60 px-4 py-2 text-sm text-muted shadow-panel backdrop-blur-xl">
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent shadow-glow" />
              Institutional Crypto Analytics Terminal
            </div>
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
              Real-time BTC and ETH market intelligence.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted md:text-base">
              Live market structure, technical scoring, support and resistance, and institutional-grade alerts.
            </p>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <TimeframeSelector />
          <div className="rounded-full border border-border bg-panel px-4 py-2 text-xs text-muted">
            {loading ? 'Loading market data...' : error ? `Error: ${error}` : 'Live stream active'}
          </div>
        </div>

        {loading ? (
          <DashboardLoading />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            <div className="space-y-6">
              <LivePriceCard />
              <SupportResistanceChart />
            </div>

            <div className="space-y-6">
              <CandlestickChart />
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
