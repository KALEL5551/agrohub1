const FLUTTERWAVE_BASE_URL = 'https://api.flutterwave.com/v3';

interface FlutterwavePaymentPayload {
  tx_ref: string;
  amount: number;
  currency: string;
  redirect_url: string;
  customer: {
    email: string;
    name: string;
    phonenumber?: string;
  };
  customizations: {
    title: string;
    description: string;
    logo: string;
  };
  meta?: Record<string, string>;
  payment_options?: string;
}

export async function initializePayment(payload: FlutterwavePaymentPayload) {
  const response = await fetch(`${FLUTTERWAVE_BASE_URL}/payments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (data.status !== 'success') {
    throw new Error(data.message || 'Payment initialization failed');
  }

  return data.data as { link: string };
}

export async function verifyTransaction(transactionId: string) {
  const response = await fetch(
    `${FLUTTERWAVE_BASE_URL}/transactions/${transactionId}/verify`,
    {
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
      },
    }
  );

  const data = await response.json();

  if (data.status !== 'success') {
    throw new Error(data.message || 'Verification failed');
  }

  return data.data as {
    id: number;
    tx_ref: string;
    amount: number;
    currency: string;
    status: string;
    payment_type: string;
    created_at: string;
  };
}

export function generateTxRef(orderId: string): string {
  return `AGT-${orderId}-${Date.now()}`;
}
