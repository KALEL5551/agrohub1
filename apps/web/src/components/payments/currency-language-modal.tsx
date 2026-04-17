'use client';
import { useState, useEffect } from 'react';
import { X, Globe, ChevronDown } from 'lucide-react';
import { useCurrencyStore } from '@/lib/forex/currency-store';

const LANGUAGES = [
  'English', 'French', 'Spanish', 'Portuguese', 'Arabic',
  'Chinese (Simplified)', 'Hindi', 'Swahili', 'Hausa',
  'Amharic', 'German', 'Dutch', 'Italian',
];

const POPULAR_CURRENCIES = [
  { code: 'USD', name: 'US Dollar',           symbol: '$',    flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro',                symbol: '€',    flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound',       symbol: '£',    flag: '🇬🇧' },
  { code: 'UGX', name: 'Ugandan Shilling',    symbol: 'USh',  flag: '🇺🇬' },
  { code: 'KES', name: 'Kenyan Shilling',     symbol: 'KSh',  flag: '🇰🇪' },
  { code: 'NGN', name: 'Nigerian Naira',      symbol: '₦',    flag: '🇳🇬' },
  { code: 'GHS', name: 'Ghanaian Cedi',       symbol: 'GH₵',  flag: '🇬🇭' },
  { code: 'ZAR', name: 'South African Rand',  symbol: 'R',    flag: '🇿🇦' },
  { code: 'TZS', name: 'Tanzanian Shilling',  symbol: 'TSh',  flag: '🇹🇿' },
  { code: 'ETB', name: 'Ethiopian Birr',      symbol: 'Br',   flag: '🇪🇹' },
  { code: 'INR', name: 'Indian Rupee',        symbol: '₹',    flag: '🇮🇳' },
  { code: 'CNY', name: 'Chinese Yuan',        symbol: '¥',    flag: '🇨🇳' },
  { code: 'BRL', name: 'Brazilian Real',      symbol: 'R$',   flag: '🇧🇷' },
  { code: 'AUD', name: 'Australian Dollar',   symbol: 'A$',   flag: '🇦🇺' },
  { code: 'CAD', name: 'Canadian Dollar',     symbol: 'C$',   flag: '🇨🇦' },
  { code: 'JPY', name: 'Japanese Yen',        symbol: '¥',    flag: '🇯🇵' },
  { code: 'SAR', name: 'Saudi Riyal',         symbol: 'SR',   flag: '🇸🇦' },
  { code: 'AED', name: 'UAE Dirham',          symbol: 'AED',  flag: '🇦🇪' },
  { code: 'EGP', name: 'Egyptian Pound',      symbol: 'E£',   flag: '🇪🇬' },
  { code: 'MXN', name: 'Mexican Peso',        symbol: 'MX$',  flag: '🇲🇽' },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CurrencyLanguageModal({ isOpen, onClose }: Props) {
  const { userCurrency, setUserCurrency } = useCurrencyStore();
  const [selectedCurrency, setSelectedCurrency] = useState(userCurrency || 'USD');
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  useEffect(() => {
    if (isOpen) setSelectedCurrency(userCurrency || 'USD');
  }, [isOpen, userCurrency]);

  const handleSave = () => {
    setUserCurrency(selectedCurrency);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Language & Currency
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Prices will display in your selected currency
            </p>
          </div>
          <button type="button" onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Language */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Language
          </label>
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={e => setSelectedLanguage(e.target.value)}
              className="w-full h-12 pl-4 pr-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium appearance-none focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            >
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Currency */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Currency
          </label>
          <div className="relative">
            <select
              value={selectedCurrency}
              onChange={e => setSelectedCurrency(e.target.value)}
              className="w-full h-12 pl-4 pr-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium appearance-none focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            >
              {POPULAR_CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code} — {c.name} ({c.symbol})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            All product prices will automatically convert to {selectedCurrency}
          </p>
        </div>

        {/* Save button */}
        <button
          type="button"
          onClick={handleSave}
          className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors text-sm"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}
