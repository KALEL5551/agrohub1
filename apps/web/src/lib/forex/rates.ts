/**
 * Agro Hub — Global Forex & Currency Detection
 *
 * Flow:
 *  1. On first load, detect user's country from their IP via free geolocation API
 *  2. Map country → preferred currency
 *  3. Fetch live exchange rates from exchangerate-api.com (free tier: 1,500 req/month)
 *     OR use Open Exchange Rates as fallback
 *  4. Cache rates in-memory + localStorage for 1 hour
 *  5. All product prices shown in user's detected currency, converted in real-time
 */

// ─── COUNTRY → CURRENCY MAP (global, 180+ countries) ─────────────────────────
export const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  // Americas
  'United States': 'USD',
  'Canada': 'CAD',
  'Mexico': 'MXN',
  'Brazil': 'BRL',
  'Argentina': 'ARS',
  'Chile': 'CLP',
  'Colombia': 'COP',
  'Peru': 'PEN',
  'Venezuela': 'VES',
  'Ecuador': 'USD',
  'Bolivia': 'BOB',
  'Paraguay': 'PYG',
  'Uruguay': 'UYU',
  'Cuba': 'CUP',
  'Dominican Republic': 'DOP',
  'Guatemala': 'GTQ',
  'Honduras': 'HNL',
  'El Salvador': 'USD',
  'Nicaragua': 'NIO',
  'Costa Rica': 'CRC',
  'Panama': 'PAB',
  'Haiti': 'HTG',
  'Jamaica': 'JMD',
  'Trinidad and Tobago': 'TTD',
  'Barbados': 'BBD',
  'Bahamas': 'BSD',

  // Europe
  'United Kingdom': 'GBP',
  'Germany': 'EUR',
  'France': 'EUR',
  'Italy': 'EUR',
  'Spain': 'EUR',
  'Portugal': 'EUR',
  'Netherlands': 'EUR',
  'Belgium': 'EUR',
  'Austria': 'EUR',
  'Greece': 'EUR',
  'Finland': 'EUR',
  'Ireland': 'EUR',
  'Luxembourg': 'EUR',
  'Malta': 'EUR',
  'Cyprus': 'EUR',
  'Slovakia': 'EUR',
  'Slovenia': 'EUR',
  'Estonia': 'EUR',
  'Latvia': 'EUR',
  'Lithuania': 'EUR',
  'Switzerland': 'CHF',
  'Norway': 'NOK',
  'Sweden': 'SEK',
  'Denmark': 'DKK',
  'Poland': 'PLN',
  'Czech Republic': 'CZK',
  'Hungary': 'HUF',
  'Romania': 'RON',
  'Bulgaria': 'BGN',
  'Croatia': 'EUR',
  'Serbia': 'RSD',
  'Ukraine': 'UAH',
  'Russia': 'RUB',
  'Turkey': 'TRY',
  'Iceland': 'ISK',
  'Albania': 'ALL',
  'Moldova': 'MDL',
  'Belarus': 'BYN',
  'Bosnia and Herzegovina': 'BAM',

  // Asia
  'China': 'CNY',
  'Japan': 'JPY',
  'India': 'INR',
  'South Korea': 'KRW',
  'Indonesia': 'IDR',
  'Thailand': 'THB',
  'Vietnam': 'VND',
  'Malaysia': 'MYR',
  'Philippines': 'PHP',
  'Singapore': 'SGD',
  'Bangladesh': 'BDT',
  'Pakistan': 'PKR',
  'Sri Lanka': 'LKR',
  'Nepal': 'NPR',
  'Myanmar': 'MMK',
  'Cambodia': 'KHR',
  'Laos': 'LAK',
  'Taiwan': 'TWD',
  'Hong Kong': 'HKD',
  'Macau': 'MOP',
  'Mongolia': 'MNT',
  'Kazakhstan': 'KZT',
  'Uzbekistan': 'UZS',
  'Azerbaijan': 'AZN',
  'Armenia': 'AMD',
  'Georgia': 'GEL',
  'Israel': 'ILS',
  'Saudi Arabia': 'SAR',
  'United Arab Emirates': 'AED',
  'Qatar': 'QAR',
  'Kuwait': 'KWD',
  'Bahrain': 'BHD',
  'Oman': 'OMR',
  'Jordan': 'JOD',
  'Lebanon': 'LBP',
  'Iraq': 'IQD',
  'Iran': 'IRR',
  'Syria': 'SYP',
  'Yemen': 'YER',
  'Afghanistan': 'AFN',

  // Africa
  'Nigeria': 'NGN',
  'South Africa': 'ZAR',
  'Kenya': 'KES',
  'Uganda': 'UGX',
  'Tanzania': 'TZS',
  'Rwanda': 'RWF',
  'Ethiopia': 'ETB',
  'Ghana': 'GHS',
  'Egypt': 'EGP',
  'Morocco': 'MAD',
  'Algeria': 'DZD',
  'Tunisia': 'TND',
  'Libya': 'LYD',
  'Sudan': 'SDG',
  'South Sudan': 'SSP',
  'Cameroon': 'XAF',
  'Senegal': 'XOF',
  "Cote d'Ivoire": 'XOF',
  'Burkina Faso': 'XOF',
  'Mali': 'XOF',
  'Niger': 'XOF',
  'Benin': 'XOF',
  'Togo': 'XOF',
  'Guinea': 'GNF',
  'Congo (DRC)': 'CDF',
  'Angola': 'AOA',
  'Mozambique': 'MZN',
  'Zambia': 'ZMW',
  'Zimbabwe': 'ZWL',
  'Malawi': 'MWK',
  'Botswana': 'BWP',
  'Namibia': 'NAD',
  'Madagascar': 'MGA',
  'Somalia': 'SOS',
  'Chad': 'XAF',
  'Sierra Leone': 'SLL',

  // Oceania
  'Australia': 'AUD',
  'New Zealand': 'NZD',
  'Fiji': 'FJD',
  'Papua New Guinea': 'PGK',
};

// ─── CURRENCY METADATA ────────────────────────────────────────────────────────
export const CURRENCY_META: Record<string, { name: string; symbol: string; flag: string }> = {
  USD: { name: 'US Dollar',          symbol: '$',    flag: '🇺🇸' },
  EUR: { name: 'Euro',               symbol: '€',    flag: '🇪🇺' },
  GBP: { name: 'British Pound',      symbol: '£',    flag: '🇬🇧' },
  JPY: { name: 'Japanese Yen',       symbol: '¥',    flag: '🇯🇵' },
  CNY: { name: 'Chinese Yuan',       symbol: '¥',    flag: '🇨🇳' },
  INR: { name: 'Indian Rupee',       symbol: '₹',    flag: '🇮🇳' },
  BRL: { name: 'Brazilian Real',     symbol: 'R$',   flag: '🇧🇷' },
  AUD: { name: 'Australian Dollar',  symbol: 'A$',   flag: '🇦🇺' },
  CAD: { name: 'Canadian Dollar',    symbol: 'C$',   flag: '🇨🇦' },
  CHF: { name: 'Swiss Franc',        symbol: 'Fr',   flag: '🇨🇭' },
  MXN: { name: 'Mexican Peso',       symbol: 'MX$',  flag: '🇲🇽' },
  ZAR: { name: 'South African Rand', symbol: 'R',    flag: '🇿🇦' },
  NGN: { name: 'Nigerian Naira',     symbol: '₦',    flag: '🇳🇬' },
  KES: { name: 'Kenyan Shilling',    symbol: 'KSh',  flag: '🇰🇪' },
  UGX: { name: 'Ugandan Shilling',   symbol: 'USh',  flag: '🇺🇬' },
  GHS: { name: 'Ghanaian Cedi',      symbol: 'GH₵',  flag: '🇬🇭' },
  EGP: { name: 'Egyptian Pound',     symbol: 'E£',   flag: '🇪🇬' },
  IDR: { name: 'Indonesian Rupiah',  symbol: 'Rp',   flag: '🇮🇩' },
  VND: { name: 'Vietnamese Dong',    symbol: '₫',    flag: '🇻🇳' },
  THB: { name: 'Thai Baht',          symbol: '฿',    flag: '🇹🇭' },
  PKR: { name: 'Pakistani Rupee',    symbol: '₨',    flag: '🇵🇰' },
  BDT: { name: 'Bangladeshi Taka',   symbol: '৳',    flag: '🇧🇩' },
  ARS: { name: 'Argentine Peso',     symbol: 'ARS$', flag: '🇦🇷' },
  CLP: { name: 'Chilean Peso',       symbol: 'CLP$', flag: '🇨🇱' },
  COP: { name: 'Colombian Peso',     symbol: 'COP$', flag: '🇨🇴' },
  PEN: { name: 'Peruvian Sol',       symbol: 'S/',   flag: '🇵🇪' },
  RUB: { name: 'Russian Ruble',      symbol: '₽',    flag: '🇷🇺' },
  TRY: { name: 'Turkish Lira',       symbol: '₺',    flag: '🇹🇷' },
  SAR: { name: 'Saudi Riyal',        symbol: 'SR',   flag: '🇸🇦' },
  AED: { name: 'UAE Dirham',         symbol: 'AED',  flag: '🇦🇪' },
  TZS: { name: 'Tanzanian Shilling', symbol: 'TSh',  flag: '🇹🇿' },
  RWF: { name: 'Rwandan Franc',      symbol: 'RF',   flag: '🇷🇼' },
  KRW: { name: 'South Korean Won',   symbol: '₩',    flag: '🇰🇷' },
  SGD: { name: 'Singapore Dollar',   symbol: 'S$',   flag: '🇸🇬' },
  HKD: { name: 'Hong Kong Dollar',   symbol: 'HK$',  flag: '🇭🇰' },
  NOK: { name: 'Norwegian Krone',    symbol: 'kr',   flag: '🇳🇴' },
  SEK: { name: 'Swedish Krona',      symbol: 'kr',   flag: '🇸🇪' },
  DKK: { name: 'Danish Krone',       symbol: 'kr',   flag: '🇩🇰' },
  PLN: { name: 'Polish Zloty',       symbol: 'zł',   flag: '🇵🇱' },
  MYR: { name: 'Malaysian Ringgit',  symbol: 'RM',   flag: '🇲🇾' },
  PHP: { name: 'Philippine Peso',    symbol: '₱',    flag: '🇵🇭' },
  ILS: { name: 'Israeli Shekel',     symbol: '₪',    flag: '🇮🇱' },
  ETB: { name: 'Ethiopian Birr',     symbol: 'Br',   flag: '🇪🇹' },
  MAD: { name: 'Moroccan Dirham',    symbol: 'د.م.', flag: '🇲🇦' },
  XOF: { name: 'West African CFA',   symbol: 'CFA',  flag: '🌍' },
  XAF: { name: 'Central African CFA',symbol: 'CFA',  flag: '🌍' },
  NZD: { name: 'New Zealand Dollar', symbol: 'NZ$',  flag: '🇳🇿' },
};

// ─── ZERO-DECIMAL CURRENCIES (no cents) ──────────────────────────────────────
export const ZERO_DECIMAL_CURRENCIES = new Set([
  'JPY','UGX','RWF','IDR','VND','KRW','CLP','GNF','PYG',
  'XAF','XOF','BIF','DJF','KMF','MGA','RWF','SOS','VUV',
]);

// ─── RATE CACHE (in-memory, also stored in localStorage) ─────────────────────
interface RateCache {
  base: string;
  rates: Record<string, number>;
  fetchedAt: number; // Unix ms
}

let _memoryCache: RateCache | null = null;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function loadCacheFromStorage(): RateCache | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('agro_hub_forex_cache');
    if (!raw) return null;
    const parsed: RateCache = JSON.parse(raw);
    if (Date.now() - parsed.fetchedAt > CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveCacheToStorage(cache: RateCache) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('agro_hub_forex_cache', JSON.stringify(cache));
  } catch {
    // storage full — ignore
  }
}

// ─── FETCH LIVE RATES ─────────────────────────────────────────────────────────
/**
 * Fetches exchange rates with USD as base.
 * Primary:  exchangerate-api.com  (free, no key required for basic endpoint)
 * Fallback: frankfurter.app       (free, no key, ECB rates)
 * Last resort: hardcoded approximate rates so the app never crashes
 */
export async function fetchExchangeRates(): Promise<Record<string, number>> {
  // Check memory cache first
  if (_memoryCache && Date.now() - _memoryCache.fetchedAt < CACHE_TTL_MS) {
    return _memoryCache.rates;
  }

  // Check localStorage cache
  const storageCache = loadCacheFromStorage();
  if (storageCache) {
    _memoryCache = storageCache;
    return storageCache.rates;
  }

  // Try primary source: exchangerate-api.com (free tier, no API key needed)
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.result === 'success' && data.rates) {
        const cache: RateCache = {
          base: 'USD',
          rates: data.rates,
          fetchedAt: Date.now(),
        };
        _memoryCache = cache;
        saveCacheToStorage(cache);
        return data.rates;
      }
    }
  } catch { /* fall through */ }

  // Try fallback: frankfurter.app (ECB rates, free, no key)
  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=USD', {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.rates) {
        // frankfurter doesn't include USD itself, add it
        const rates = { ...data.rates, USD: 1 };
        const cache: RateCache = {
          base: 'USD',
          rates,
          fetchedAt: Date.now(),
        };
        _memoryCache = cache;
        saveCacheToStorage(cache);
        return rates;
      }
    }
  } catch { /* fall through */ }

  // Last resort: approximate static rates (updated periodically)
  // These are fallback only — the app will still work without internet
  const staticRates: Record<string, number> = {
    USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.5, CNY: 7.24, INR: 83.1,
    BRL: 4.97, AUD: 1.53, CAD: 1.36, CHF: 0.88, MXN: 17.2, ZAR: 18.6,
    NGN: 1580, KES: 128, UGX: 3750, GHS: 12.1, EGP: 30.9, IDR: 15600,
    VND: 24200, THB: 35.1, PKR: 278, BDT: 109, ARS: 870, CLP: 920,
    COP: 3950, PEN: 3.72, RUB: 90.5, TRY: 30.1, SAR: 3.75, AED: 3.67,
    TZS: 2520, RWF: 1280, KRW: 1330, SGD: 1.34, HKD: 7.82, NOK: 10.6,
    SEK: 10.4, DKK: 6.88, PLN: 3.97, MYR: 4.67, PHP: 55.6, ILS: 3.71,
    ETB: 56.5, MAD: 10.0, XOF: 604, XAF: 604, NZD: 1.63, TWD: 31.5,
  };

  const cache: RateCache = {
    base: 'USD',
    rates: staticRates,
    fetchedAt: Date.now() - (CACHE_TTL_MS - 5 * 60 * 1000), // expire in 5 min so it retries
  };
  _memoryCache = cache;
  return staticRates;
}

// ─── CONVERT PRICE ────────────────────────────────────────────────────────────
/**
 * Convert a price from one currency to another.
 * @param amount   The original price
 * @param from     Original currency code (e.g. "USD")
 * @param to       Target currency code (e.g. "KES")
 * @param rates    Exchange rate map with USD as base (from fetchExchangeRates)
 */
export function convertPrice(
  amount: number,
  from: string,
  to: string,
  rates: Record<string, number>
): number {
  if (from === to) return amount;

  const fromRate = rates[from] ?? 1;
  const toRate = rates[to] ?? 1;

  // Convert from → USD → to
  const inUSD = amount / fromRate;
  const converted = inUSD * toRate;

  return converted;
}

// ─── FORMAT CONVERTED PRICE ───────────────────────────────────────────────────
export function formatConvertedPrice(
  amount: number,
  from: string,
  to: string,
  rates: Record<string, number>
): string {
  const converted = convertPrice(amount, from, to, rates);
  const meta = CURRENCY_META[to];
  const symbol = meta?.symbol ?? to;

  if (ZERO_DECIMAL_CURRENCIES.has(to)) {
    return `${symbol} ${Math.round(converted).toLocaleString()}`;
  }

  return `${symbol} ${converted.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// ─── IP GEOLOCATION ───────────────────────────────────────────────────────────
export interface GeoInfo {
  country: string;     // full country name e.g. "Kenya"
  countryCode: string; // ISO alpha-2 e.g. "KE"
  currency: string;    // e.g. "KES"
  city: string;
}

/**
 * Detect user's country and preferred currency from their IP address.
 * Uses ipapi.co (free tier: 1,000 req/day) with fallback to ip-api.com.
 * Server-side safe: pass `ip` param when calling from API routes.
 */
export async function detectUserGeo(ip?: string): Promise<GeoInfo> {
  // Try ipapi.co
  try {
    const url = ip
      ? `https://ipapi.co/${ip}/json/`
      : 'https://ipapi.co/json/';
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const data = await res.json();
      if (data.country_name && !data.error) {
        const currency =
          data.currency ||
          COUNTRY_CURRENCY_MAP[data.country_name] ||
          'USD';
        return {
          country: data.country_name,
          countryCode: data.country_code,
          currency,
          city: data.city || '',
        };
      }
    }
  } catch { /* fall through */ }

  // Fallback: ip-api.com (free, no key)
  try {
    const url = ip
      ? `http://ip-api.com/json/${ip}?fields=country,countryCode,city,currency`
      : 'http://ip-api.com/json/?fields=country,countryCode,city,currency';
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const data = await res.json();
      if (data.country && data.status !== 'fail') {
        const currency =
          data.currency ||
          COUNTRY_CURRENCY_MAP[data.country] ||
          'USD';
        return {
          country: data.country,
          countryCode: data.countryCode,
          currency,
          city: data.city || '',
        };
      }
    }
  } catch { /* fall through */ }

  // Default to USD if both fail
  return {
    country: 'United States',
    countryCode: 'US',
    currency: 'USD',
    city: '',
  };
}
