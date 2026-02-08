import { createContext, useContext, ReactNode } from 'react';
import { useProfile } from '@/hooks/useData';

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$', EUR: '€', GBP: '£', INR: '₹', JPY: '¥', CAD: 'C$', AUD: 'A$',
};

interface CurrencyContextType {
  currency: string;
  symbol: string;
  formatAmount: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'USD',
  symbol: '$',
  formatAmount: (a) => `$${a.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const { profile } = useProfile();
  const currency = profile.data?.currency || 'USD';
  const symbol = CURRENCY_SYMBOLS[currency] || currency;

  const formatAmount = (amount: number) =>
    `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  return (
    <CurrencyContext.Provider value={{ currency, symbol, formatAmount }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
