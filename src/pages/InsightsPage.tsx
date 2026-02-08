import { useMemo } from 'react';
import { PageShell } from '@/components/PageShell';
import { BottomNav } from '@/components/BottomNav';
import { InsightCard } from '@/components/InsightCard';
import { useExpenses, useCategories, useIncome, useBudgets } from '@/hooks/useData';
import { useCurrency } from '@/contexts/CurrencyContext';

export default function InsightsPage() {
  const { allExpenses } = useExpenses();
  const { categories } = useCategories();
  const { income } = useIncome();
  const { budgets } = useBudgets();
  const { formatAmount } = useCurrency();

  const insights = useMemo(() => {
    const expenses = allExpenses.data || [];
    const totalIncome = income.data?.reduce((s, i) => s + Number(i.amount), 0) ?? 0;
    const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
    const result: { title: string; description: string; type: 'info' | 'warning' | 'positive' | 'negative' }[] = [];

    const days = new Set(expenses.map((e) => e.expense_date)).size || 1;
    result.push({ title: 'Daily Average', description: `You spend about ${formatAmount(totalExpenses / days)} per day`, type: 'info' });

    // Category breakdown
    const catMap: Record<string, number> = {};
    expenses.forEach((e) => { const n = e.categories?.name || 'Other'; catMap[n] = (catMap[n] || 0) + Number(e.amount); });
    const sorted = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
    if (sorted[0]) result.push({ title: 'Top Category', description: `${sorted[0][0]} at ${formatAmount(sorted[0][1])}`, type: 'negative' });

    // Budget health
    if (totalIncome > 0) {
      const ratio = totalExpenses / totalIncome;
      if (ratio > 0.9) result.push({ title: 'Overspending Alert', description: `You've spent ${(ratio * 100).toFixed(0)}% of your income!`, type: 'warning' });
      else if (ratio < 0.5) result.push({ title: 'Great Savings', description: `You've only used ${(ratio * 100).toFixed(0)}% of your income`, type: 'positive' });
      else result.push({ title: 'Moderate Spending', description: `${(ratio * 100).toFixed(0)}% of income used`, type: 'info' });
    }

    // Weekly comparison
    const now = new Date();
    const thisWeek = expenses.filter((e) => {
      const d = new Date(e.expense_date);
      return (now.getTime() - d.getTime()) / 86400000 <= 7;
    });
    const lastWeek = expenses.filter((e) => {
      const d = new Date(e.expense_date);
      const diff = (now.getTime() - d.getTime()) / 86400000;
      return diff > 7 && diff <= 14;
    });
    const thisWeekTotal = thisWeek.reduce((s, e) => s + Number(e.amount), 0);
    const lastWeekTotal = lastWeek.reduce((s, e) => s + Number(e.amount), 0);

    if (lastWeekTotal > 0) {
      const pctChange = ((thisWeekTotal - lastWeekTotal) / lastWeekTotal * 100).toFixed(0);
      const increased = thisWeekTotal > lastWeekTotal;
      result.push({
        title: 'Weekly Trend',
        description: increased
          ? `Spending increased ${pctChange}% compared to last week`
          : `Spending decreased ${Math.abs(Number(pctChange))}% compared to last week`,
        type: increased ? 'warning' : 'positive',
      });
    }

    // Budget nearing limit
    if (budgets.data) {
      const monthExpenses = expenses.filter((e) => {
        const d = new Date(e.expense_date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
      budgets.data.forEach((b) => {
        const spent = monthExpenses.filter((e) => e.category_id === b.category_id).reduce((s, e) => s + Number(e.amount), 0);
        const ratio = spent / Number(b.amount);
        if (ratio >= 0.7 && ratio < 1) {
          result.push({
            title: 'Budget Alert',
            description: `${b.categories?.name || 'Category'} is using ${(ratio * 100).toFixed(0)}% of monthly budget. Set a weekly limit.`,
            type: 'warning',
          });
        }
      });
    }

    // Dynamic suggested actions based on real data
    if (sorted[0] && totalExpenses > 0) {
      const topPct = ((sorted[0][1] / totalExpenses) * 100).toFixed(0);

      // Highest overspending
      if (lastWeekTotal > 0) {
        const thisWeekCat: Record<string, number> = {};
        const lastWeekCat: Record<string, number> = {};
        thisWeek.forEach((e) => { const n = e.categories?.name || 'Other'; thisWeekCat[n] = (thisWeekCat[n] || 0) + Number(e.amount); });
        lastWeek.forEach((e) => { const n = e.categories?.name || 'Other'; lastWeekCat[n] = (lastWeekCat[n] || 0) + Number(e.amount); });

        for (const [cat, amt] of Object.entries(thisWeekCat)) {
          const prev = lastWeekCat[cat] || 0;
          if (prev > 0 && amt > prev * 1.3) {
            const inc = (((amt - prev) / prev) * 100).toFixed(0);
            result.push({
              title: 'Suggested Action',
              description: `${cat} expenses increased ${inc}% compared to last week. Try reducing spending in this area.`,
              type: 'warning',
            });
            break;
          }
        }
      } else {
        result.push({
          title: 'Suggested Action',
          description: `Reduce ${sorted[0][0]} expenses — it accounts for ${topPct}% of your total spending.`,
          type: 'warning',
        });
      }
    }

    // Savings opportunity
    if (totalIncome > 0 && totalExpenses < totalIncome) {
      const saveable = ((totalIncome - totalExpenses) * 0.1).toFixed(0);
      result.push({ title: 'Savings Goal', description: `Increase monthly savings by ${formatAmount(Number(saveable))} based on your spending patterns.`, type: 'positive' });
    }

    // Unusual spike
    if (sorted.length >= 2) {
      const second = sorted[1];
      if (second[1] > totalExpenses * 0.25) {
        result.push({ title: 'Unusual Spike', description: `Your ${second[0]} category is unusually high this month — reduce optional purchases.`, type: 'warning' });
      }
    }

    return result;
  }, [allExpenses.data, income.data, budgets.data, formatAmount]);

  return (
    <div className="min-h-screen bg-background">
      <PageShell title="Smart Insights">
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
