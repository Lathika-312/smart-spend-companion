import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, Plus } from 'lucide-react';

interface BalanceCardProps {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  onAddIncome: () => void;
}

export function BalanceCard({ totalBalance, totalIncome, totalExpenses, onAddIncome }: BalanceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="gradient-primary rounded-2xl p-6 text-primary-foreground shadow-elevated"
    >
      <p className="text-sm opacity-80 mb-1">Total Balance</p>
      <h2 className="text-3xl font-display font-bold mb-4">
        ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </h2>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs opacity-70">Income</p>
            <p className="text-sm font-semibold">${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <TrendingDown className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs opacity-70">Expenses</p>
            <p className="text-sm font-semibold">${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        <button
          onClick={onAddIncome}
          className="h-10 w-10 rounded-full bg-primary-foreground/20 hover:bg-primary-foreground/30 flex items-center justify-center transition-colors"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
}
