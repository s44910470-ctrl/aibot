import { NextResponse } from 'next/server';
import type { SymbolType } from '@/types/market';
import { getMockMarketSnapshot } from '@/lib/market/mock';

function isSymbol(value: string | null): value is SymbolType {
  return value === 'BTCUSDT' || value === 'ETHUSDT';
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  if (!isSymbol(symbol)) {
    return NextResponse.json(
      { ok: false, error: 'Invalid or missing symbol. Use BTCUSDT or ETHUSDT.' },
      { status: 400 },
    );
  }

  const data = getMockMarketSnapshot(symbol);
  return NextResponse.json({ ok: true, data });
}
