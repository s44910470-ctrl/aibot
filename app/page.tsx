const metrics = [
  { label: 'BTC/USDT', value: 'Live' },
  { label: 'ETH/USDT', value: 'Live' },
  { label: 'Trend', value: 'Ready' },
  { label: 'Alerts', value: 'Enabled' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-bg text-text">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-16">
        <div className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-panel/60 px-4 py-2 text-sm text-muted shadow-panel backdrop-blur-xl">
          <span className="h-2 w-2 animate-pulse rounded-full bg-accent shadow-glow" />
          Institutional Crypto Analytics Terminal
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
          <div>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight md:text-7xl">
              Real-time BTC and ETH market intelligence.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted md:text-lg">
              A premium crypto desk interface for live market structure, technical scoring,
              support and resistance analysis, and institutional-grade alerts.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-border bg-panel/70 p-4 shadow-panel backdrop-blur-xl"
                >
                  <div className="text-sm text-muted">{metric.label}</div>
                  <div className="mt-2 text-2xl font-semibold">{metric.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-panel/70 p-6 shadow-glow backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted">System Status</div>
                <div className="mt-1 text-xl font-semibold">Foundation Ready</div>
              </div>
              <div className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs text-accent">
                Phase 1
              </div>
            </div>
            <div className="mt-6 space-y-3 text-sm text-muted">
              <p>• Next.js app structure</p>
              <p>• Type-safe data models</p>
              <p>• Zustand store scaffolding</p>
              <p>• Dark premium UI system</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
