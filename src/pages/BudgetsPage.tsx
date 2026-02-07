import { useState, useMemo } from 'react';
import { PageShell } from '@/components/PageShell';
import { useCategories, useBudgets, useExpenses } from '@/hooks/useData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';

export default function BudgetsPage() {
  const { categories } = useCategories();
  const { budgets, upsertBudget } = useBudgets();
  const { allExpenses } = useExpenses();
  const [editAmounts, setEditAmounts] = useState<Record<string, string>>({});

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const spentByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    allExpenses.data
      ?.filter((e) => {
        const d = new Date(e.expense_date);
        return d.getMonth() + 1 === month && d.getFullYear() === year;
      })
      .forEach((e) => {
        const cid = e.category_id || 'other';
        map[cid] = (map[cid] || 0) + Number(e.amount);
      });
    return map;
  }, [allExpenses.data, month, year]);

  const getBudgetForCategory = (catId: string) => {
    return budgets.data?.find((b) => b.category_id === catId);
  };

  const handleSave = (categoryId: string) => {
    const amount = parseFloat(editAmounts[categoryId] || '0');
    if (!amount) { toast.error('Enter a valid amount'); return; }
    upsertBudget.mutate({ category_id: categoryId, amount, month, year }, {
      onSuccess: () => toast.success('Budget saved'),
      onError: () => toast.error('Failed to save'),
    });
  };

  return (
    <PageShell title="Budgets">
      <div className="gradient-primary rounded-2xl p-5 mb-6 text-primary-foreground">
        <p className="text-sm opacity-80">Monthly Budget</p>
        <h2 className="text-2xl font-display font-bold">
          ${budgets.data?.reduce((s, b) => s + Number(b.amount), 0).toFixed(2) || '0.00'}
        </h2>
        <p className="text-xs opacity-70 mt-1">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
      </div>

      <div className="space-y-4">
        {categories.data?.map((cat) => {
          const budget = getBudgetForCategory(cat.id);
          const spent = spentByCategory[cat.id] || 0;
          const budgetAmount = budget ? Number(budget.amount) : 0;
          const pct = budgetAmount > 0 ? Math.min((spent / budgetAmount) * 100, 100) : 0;
          const isOver80 = pct >= 80;

          return (
            <div key={cat.id} className="bg-card rounded-2xl p-4 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{cat.icon}</span>
                  <span className="font-medium text-sm text-foreground">{cat.name}</span>
                </div>
                {isOver80 && (
                  <div className="flex items-center gap-1 text-warning text-xs font-medium">
                    <AlertTriangle className="h-3 w-3" /> {pct.toFixed(0)}%
                  </div>
                )}
              </div>

              {budgetAmount > 0 && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>${spent.toFixed(2)} spent</span>
                    <span>${budgetAmount.toFixed(2)} budget</span>
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>
              )}

              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder={budgetAmount > 0 ? budgetAmount.toString() : 'Set budget'}
                  value={editAmounts[cat.id] || ''}
                  onChange={(e) => setEditAmounts({ ...editAmounts, [cat.id]: e.target.value })}
                  className="h-9 rounded-lg text-sm flex-1"
                />
                <Button onClick={() => handleSave(cat.id)} size="sm" className="rounded-lg gradient-primary text-primary-foreground text-xs px-4">
                  Save
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
