import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, Plus } from 'lucide-react';
import { BalanceCard } from '@/components/BalanceCard';
import { ExpenseItem } from '@/components/ExpenseItem';
import { AddExpenseModal } from '@/components/AddExpenseModal';
import { AddIncomeModal } from '@/components/AddIncomeModal';
import { SideDrawer } from '@/components/SideDrawer';
import { BottomNav } from '@/components/BottomNav';
import { InsightCard } from '@/components/InsightCard';
import { useExpenses, useCategories, useIncome, useBudgets } from '@/hooks/useData';
import { useCurrency } from '@/contexts/CurrencyContext';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const { todayExpenses, deleteExpense, addExpense, allExpenses } = useExpenses();
  const { categories } = useCategories();
  const { income, addIncome } = useIncome();
  const { budgets } = useBudgets();
  const { formatAmount } = useCurrency();

  const totalIncome = useMemo(() => income.data?.reduce((s, i) => s + Number(i.amount), 0) ?? 0, [income.data]);
  const totalExpenses = useMemo(() => todayExpenses.data?.reduce((s, e) => s + Number(e.amount), 0) ?? 0, [todayExpenses.data]);

  // Budget notification check
  useEffect(() => {
    if (!budgets.data || !allExpenses.data) return;
    const now = new Date();
    const monthExpenses = allExpenses.data.filter((e) => {
      const d = new Date(e.expense_date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    budgets.data.forEach((budget) => {
      const catSpent = monthExpenses
        .filter((e) => e.category_id === budget.category_id)
        .reduce((s, e) => s + Number(e.amount), 0);
      const ratio = catSpent / Number(budget.amount);
      const catName = budget.categories?.name || 'Category';
      if (ratio >= 1) {
        toast.warning(`${catName} budget exceeded! ${formatAmount(catSpent)} / ${formatAmount(Number(budget.amount))}`);
      } else if (ratio >= 0.8) {
        toast.info(`${catName} budget at ${(ratio * 100).toFixed(0)}% — ${formatAmount(catSpent)} / ${formatAmount(Number(budget.amount))}`);
      }
    });
  }, [budgets.data, allExpenses.data, formatAmount]);

  const handleAddExpense = (data: any) => {
    addExpense.mutate(data, { onSuccess: () => toast.success('Expense added!'), onError: () => toast.error('Failed to add expense') });
  };

  const handleAddIncome = (data: any) => {
    addIncome.mutate(data, { onSuccess: () => toast.success('Income added!'), onError: () => toast.error('Failed to add income') });
  };

  const handleDelete = (id: string) => {
    deleteExpense.mutate(id, { onSuccess: () => toast.success('Expense deleted'), onError: () => toast.error('Failed to delete') });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-lg border-b border-border px-4 py-3 flex items-center justify-between">
        <button onClick={() => setDrawerOpen(true)} className="h-9 w-9 rounded-xl hover:bg-secondary flex items-center justify-center">
          <Menu className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-lg font-display font-bold text-foreground">Dashboard</h1>
        <div className="w-9" />
      </header>

      <main className="p-4 pb-24 max-w-lg mx-auto space-y-6">
        {/* Balance Card */}
        <BalanceCard
          totalBalance={totalIncome - totalExpenses}
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          onAddIncome={() => setIncomeModalOpen(true)}
        />

        {/* Insights */}
        <div className="grid grid-cols-2 gap-3">
          <InsightCard
            title="Daily Average"
            description={`${formatAmount(totalExpenses / 7)} per day this week`}
            type="info"
          />
          <InsightCard
            title={totalExpenses > totalIncome * 0.8 ? 'Overspending!' : 'On Track'}
            description={totalExpenses > totalIncome * 0.8 ? 'You are spending too much' : 'Your spending is within budget'}
            type={totalExpenses > totalIncome * 0.8 ? 'warning' : 'positive'}
          />
        </div>

        {/* Today's Expenses */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Today's Expenses</h2>
          <div className="space-y-2">
            {todayExpenses.data?.length === 0 && (
              <p className="text-center text-muted-foreground text-sm py-8">No expenses today. Tap + to add one.</p>
            )}
            {todayExpenses.data?.map((expense) => (
              <ExpenseItem
                key={expense.id}
                id={expense.id}
                description={expense.description}
                amount={Number(expense.amount)}
                time={expense.expense_time?.slice(0, 5) || ''}
                categoryIcon={expense.categories?.icon || '📦'}
                categoryName={expense.categories?.name || 'Other'}
                categoryColor={expense.categories?.color || '#6B7280'}
                onEdit={() => {}}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      </main>

      {/* FAB - Centered */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setExpenseModalOpen(true)}
        className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 h-14 px-6 gradient-primary rounded-full shadow-elevated flex items-center justify-center gap-2 text-primary-foreground"
      >
        <Plus className="h-5 w-5" />
        <span className="font-semibold text-sm">Add Expense</span>
      </motion.button>

      <BottomNav />
      <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <AddExpenseModal open={expenseModalOpen} onClose={() => setExpenseModalOpen(false)} onSubmit={handleAddExpense} categories={categories.data || []} />
      <AddIncomeModal open={incomeModalOpen} onClose={() => setIncomeModalOpen(false)} onSubmit={handleAddIncome} />
    </div>
  );
}
