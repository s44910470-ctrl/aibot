import { NextResponse } from 'next/server';
import type { SymbolType } from '@/types/market';
import { getMarketSnapshot } from '@/lib/market/service';
import { detectSupportResistanceZones } from '@/lib/indicators/supportResistance';
import { analyzeMarket } from '@/lib/analysis/marketScore';

function isSymbol(value: string | null): value is SymbolType {
  return value === 'BTCUSDT' || value === 'ETHUSDT';
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const timeframe = searchParams.get('timeframe') ?? '5m';

  if (!isSymbol(symbol)) {
    return NextResponse.json(
      { ok: false, error: 'Invalid or missing symbol. Use BTCUSDT or ETHUSDT.' },
      { status: 400 },
    );
  }

  const snapshot = await getMarketSnapshot(symbol, timeframe);
  const zones = detectSupportResistanceZones(snapshot.candles, snapshot.symbol);
  const analysis = analyzeMarket(snapshot.candles, zones);

  return NextResponse.json({ ok: true, data: analysis, zones });
}
