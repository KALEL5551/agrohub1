const DHL_BASE_URL = 'https://express.api.dhl.com/mydhlapi';

interface DHLQuoteParams {
  originCountryCode: string;
  destinationCountryCode: string;
  originCity: string;
  destinationCity: string;
  weight: number;
  length: number;
  width: number;
  height: number;
}

export async function getShippingQuotes(params: DHLQuoteParams) {
  const queryParams = new URLSearchParams({
    accountNumber: process.env.DHL_ACCOUNT_NUMBER!,
    originCountryCode: params.originCountryCode,
    originCityName: params.originCity,
    destinationCountryCode: params.destinationCountryCode,
    destinationCityName: params.destinationCity,
    weight: params.weight.toString(),
    length: params.length.toString(),
    width: params.width.toString(),
    height: params.height.toString(),
    plannedShippingDate: new Date().toISOString().split('T')[0],
    isCustomsDeclarable: 'true',
    unitOfMeasurement: 'metric',
  });

  const credentials = Buffer.from(
    `${process.env.DHL_API_KEY}:${process.env.DHL_API_SECRET}`
  ).toString('base64');

  const response = await fetch(`${DHL_BASE_URL}/rates?${queryParams}`, {
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('DHL API error:', error);
    throw new Error('Failed to get shipping quotes from DHL');
  }

  const data = await response.json();

  return (data.products || []).map((product: {
    productName?: string;
    totalPrice?: Array<{ price?: number; priceCurrency?: string }>;
    deliveryCapabilities?: { estimatedDeliveryDateAndTime?: string };
  }) => ({
    carrier: 'DHL',
    service_name: product.productName,
    price: product.totalPrice?.[0]?.price || 0,
    currency: product.totalPrice?.[0]?.priceCurrency || 'USD',
    estimated_days: product.deliveryCapabilities?.estimatedDeliveryDateAndTime
      ? Math.ceil(
          (new Date(product.deliveryCapabilities.estimatedDeliveryDateAndTime).getTime() -
            Date.now()) /
            86400000
        )
      : 7,
  }));
}

export function applyShippingMarkup(baseCost: number, markupPercent: number = 15): number {
  return Math.round(baseCost * (1 + markupPercent / 100));
}
