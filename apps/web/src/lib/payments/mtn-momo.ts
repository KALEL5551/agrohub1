const MTN_MOMO_BASE_URL =
  process.env.MTN_MOMO_ENVIRONMENT === 'production'
    ? 'https://proxy.momoapi.mtn.com'
    : 'https://sandbox.momodeveloper.mtn.com';

async function getAccessToken(): Promise<string> {
  const credentials = Buffer.from(
    `${process.env.MTN_MOMO_API_USER}:${process.env.MTN_MOMO_API_KEY}`
  ).toString('base64');

  const response = await fetch(
    `${MTN_MOMO_BASE_URL}/collection/token/`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Ocp-Apim-Subscription-Key': process.env.MTN_MOMO_SUBSCRIPTION_KEY!,
      },
    }
  );

  const data = await response.json();
  return data.access_token;
}

export async function requestToPay(params: {
  amount: number;
  currency: string;
  externalId: string;
  partyId: string;
  payerMessage: string;
  payeeNote: string;
}) {
  const token = await getAccessToken();
  const referenceId = crypto.randomUUID();

  const response = await fetch(
    `${MTN_MOMO_BASE_URL}/collection/v1_0/requesttopay`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Reference-Id': referenceId,
        'X-Target-Environment': process.env.MTN_MOMO_ENVIRONMENT || 'sandbox',
        'Ocp-Apim-Subscription-Key': process.env.MTN_MOMO_SUBSCRIPTION_KEY!,
        'Content-Type': 'application/json',
        'X-Callback-Url': process.env.MTN_MOMO_CALLBACK_URL!,
      },
      body: JSON.stringify({
        amount: params.amount.toString(),
        currency: params.currency,
        externalId: params.externalId,
        payer: {
          partyIdType: 'MSISDN',
          partyId: params.partyId,
        },
        payerMessage: params.payerMessage,
        payeeNote: params.payeeNote,
      }),
    }
  );

  if (response.status !== 202) {
    throw new Error('MTN MoMo payment request failed');
  }

  return { referenceId };
}

export async function getPaymentStatus(referenceId: string) {
  const token = await getAccessToken();

  const response = await fetch(
    `${MTN_MOMO_BASE_URL}/collection/v1_0/requesttopay/${referenceId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Target-Environment': process.env.MTN_MOMO_ENVIRONMENT || 'sandbox',
        'Ocp-Apim-Subscription-Key': process.env.MTN_MOMO_SUBSCRIPTION_KEY!,
      },
    }
  );

  return response.json() as Promise<{
    status: 'PENDING' | 'SUCCESSFUL' | 'FAILED';
    reason?: string;
    amount: string;
    currency: string;
    externalId: string;
  }>;
}
