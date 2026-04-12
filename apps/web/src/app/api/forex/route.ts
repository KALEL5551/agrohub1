import { NextRequest, NextResponse } from 'next/server';
import { fetchExchangeRates, detectUserGeo, convertPrice } from '@/lib/forex/rates';

/**
 * GET /api/forex
 * Returns live exchange rates + user's detected currency.
 * Called by the ForexProvider on app boot.
 *
 * Response:
 *   { rates: {...}, userCurrency: "KES", geo: { country, city } }
 */
export async function GET(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      undefined;

    const [rates, geo] = await Promise.all([
      fetchExchangeRates(),
      detectUserGeo(ip),
    ]);

    return NextResponse.json(
      { success: true, rates, geo, userCurrency: geo.currency },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300',
        },
      }
    );

  } catch (err) {
    console.error('Forex API error:', err);
    return NextResponse.json(
      { success: false, rates: {}, geo: null, userCurrency: 'USD' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/forex
 * Convert a specific amount.
 * Body: { amount: number, from: string, to: string }
 * Response: { converted: number, formatted: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { amount, from, to } = await request.json();
    if (!amount || !from || !to) {
      return NextResponse.json({ error: 'amount, from, and to are required' }, { status: 400 });
    }
    const rates = await fetchExchangeRates();
    const converted = convertPrice(Number(amount), from, to, rates);
    return NextResponse.json({ success: true, converted, from, to, rate: converted / amount });
  } catch (err) {
    return NextResponse.json({ error: 'Conversion failed' }, { status: 500 });
  }
}
