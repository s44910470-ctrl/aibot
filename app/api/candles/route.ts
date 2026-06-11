import { NextResponse } from 'next/server';
import type { SymbolType } from '@/types/market';
import { getCandleSeries } from '@/lib/market/service';

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

  const candles = await getCandleSeries(symbol, timeframe);

  return NextResponse.json({
    ok: true,
    timeframe,
    data: candles,
  });
}
