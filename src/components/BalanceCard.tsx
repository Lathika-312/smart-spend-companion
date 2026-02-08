import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';

interface BalanceCardProps {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  onAddIncome: () => void;
}

export function BalanceCard({ totalBalance, totalIncome, totalExpenses, onAddIncome }: BalanceCardProps) {
  const { formatAmount } = useCurrency();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="gradient-primary rounded-2xl p-6 text-primary-foreground shadow-elevated"
    >
      <p className="text-sm opacity-80 mb-1">Total Balance</p>
      <h2 className="text-3xl font-display font-bold mb-4">
        {formatAmount(totalBalance)}
      </h2>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-xs opacity-70">Income</p>
              <button
                onClick={onAddIncome}
                className="h-5 w-5 rounded-full bg-primary-foreground/30 hover:bg-primary-foreground/40 flex items-center justify-center transition-colors"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            <p className="text-sm font-semibold">{formatAmount(totalIncome)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <TrendingDown className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs opacity-70">Expenses</p>
            <p className="text-sm font-semibold">{formatAmount(totalExpenses)}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
