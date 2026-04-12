import { NextRequest, NextResponse } from 'next/server';
import { getShippingQuotes, applyShippingMarkup } from '@/lib/shipping/dhl';

const countryToCode: Record<string, string> = {
  Uganda: 'UG',
  Kenya: 'KE',
  Tanzania: 'TZ',
  Rwanda: 'RW',
  Nigeria: 'NG',
  Ghana: 'GH',
  'South Africa': 'ZA',
  DRC: 'CD',
  Ethiopia: 'ET',
  Senegal: 'SN',
  Cameroon: 'CM',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { origin_country, destination_country, weight_kg, dimensions } = body;

    const originCode = countryToCode[origin_country] || 'UG';
    const destCode = countryToCode[destination_country] || 'KE';

    const quotes = await getShippingQuotes({
      originCountryCode: originCode,
      destinationCountryCode: destCode,
      originCity: 'Kampala',
      destinationCity: 'Nairobi',
      weight: weight_kg,
      length: dimensions?.length || 30,
      width: dimensions?.width || 20,
      height: dimensions?.height || 15,
    });

    const quotesWithMarkup = quotes.map(
      (
        q: {
          carrier: string;
          service_name: string;
          price: number;
          currency: string;
          estimated_days: number;
        },
        i: number
      ) => ({
        id: `quote-${i}-${q.carrier}`,
        ...q,
        origin_country,
        destination_country,
        price: applyShippingMarkup(q.price),
      })
    );

    return NextResponse.json({ success: true, data: quotesWithMarkup });
  } catch (error: unknown) {
    console.error('Shipping quotes error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to get shipping quotes' },
      { status: 500 }
    );
  }
}
