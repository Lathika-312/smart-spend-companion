import { useMemo } from 'react';
import { PageShell } from '@/components/PageShell';
import { BottomNav } from '@/components/BottomNav';
import { InsightCard } from '@/components/InsightCard';
import { useExpenses, useCategories, useIncome } from '@/hooks/useData';

export default function InsightsPage() {
  const { allExpenses } = useExpenses();
  const { categories } = useCategories();
  const { income } = useIncome();

  const insights = useMemo(() => {
    const expenses = allExpenses.data || [];
    const totalIncome = income.data?.reduce((s, i) => s + Number(i.amount), 0) ?? 0;
    const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
    const result: { title: string; description: string; type: 'info' | 'warning' | 'positive' | 'negative' }[] = [];

    // Daily average
    const days = new Set(expenses.map((e) => e.expense_date)).size || 1;
    result.push({ title: 'Daily Average', description: `You spend about $${(totalExpenses / days).toFixed(2)} per day`, type: 'info' });

    // Top category
    const catMap: Record<string, number> = {};
    expenses.forEach((e) => { const n = e.categories?.name || 'Other'; catMap[n] = (catMap[n] || 0) + Number(e.amount); });
    const sorted = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
    if (sorted[0]) result.push({ title: 'Top Category', description: `${sorted[0][0]} at $${sorted[0][1].toFixed(2)}`, type: 'negative' });

    // Budget health
    if (totalIncome > 0) {
      const ratio = totalExpenses / totalIncome;
      if (ratio > 0.9) result.push({ title: 'Overspending Alert', description: `You've spent ${(ratio * 100).toFixed(0)}% of your income!`, type: 'warning' });
      else if (ratio < 0.5) result.push({ title: 'Great Savings', description: `You've only used ${(ratio * 100).toFixed(0)}% of your income`, type: 'positive' });
      else result.push({ title: 'Moderate Spending', description: `${(ratio * 100).toFixed(0)}% of income used`, type: 'info' });
    }

    // Category comparison
    if (sorted.length >= 2) {
      const diff = ((sorted[0][1] - sorted[1][1]) / sorted[1][1] * 100).toFixed(0);
      result.push({ title: 'Category Gap', description: `${sorted[0][0]} is ${diff}% higher than ${sorted[1][0]}`, type: 'info' });
    }

    result.push({ title: 'Suggested Action', description: 'Try setting category budgets to control spending in your top areas', type: 'positive' });

    return result;
  }, [allExpenses.data, income.data]);

  return (
    <div className="min-h-screen bg-background">
      <PageShell title="Smart Insights">
        {/* Summary */}
        <div className="gradient-primary rounded-2xl p-5 mb-6 text-primary-foreground">
          <h3 className="font-display font-bold text-lg mb-1">Your Financial Summary</h3>
          <p className="text-sm opacity-80">AI-powered insights based on your spending patterns</p>
        </div>

        <div className="space-y-3">
          {insights.map((insight, i) => (
            <InsightCard key={i} {...insight} />
          ))}
        </div>
      </PageShell>
      <BottomNav />
    </div>
  );
}
