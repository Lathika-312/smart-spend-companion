import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { PageShell } from '@/components/PageShell';
import { useExpenses, useCategories } from '@/hooks/useData';
import { useCurrency } from '@/contexts/CurrencyContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

type TimeFilter = 'today' | 'week' | 'month';

export default function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { allExpenses } = useExpenses();
  const { categories } = useCategories();
  const { formatAmount } = useCurrency();
  const [filter, setFilter] = useState<TimeFilter>('month');

  const category = useMemo(() => categories.data?.find((c) => c.id === id), [categories.data, id]);

  const filteredExpenses = useMemo(() => {
    const all = (allExpenses.data || []).filter((e) => e.category_id === id);
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    if (filter === 'today') return all.filter((e) => e.expense_date === today);
    if (filter === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return all.filter((e) => new Date(e.expense_date) >= weekAgo);
    }
    // month
    return all.filter((e) => {
      const d = new Date(e.expense_date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
  }, [allExpenses.data, id, filter]);

  const totalSpent = useMemo(() => filteredExpenses.reduce((s, e) => s + Number(e.amount), 0), [filteredExpenses]);

  const chartData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredExpenses.forEach((e) => {
      const key = filter === 'today' ? (e.expense_time?.slice(0, 2) + ':00' || 'N/A') : e.expense_date;
      map[key] = (map[key] || 0) + Number(e.amount);
    });
    return Object.entries(map)
      .map(([name, amount]) => ({ name: filter === 'today' ? name : name.slice(5), amount }))
      .slice(-10);
  }, [filteredExpenses, filter]);

  const filters: { label: string; value: TimeFilter }[] = [
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' },
  ];

  if (!category) return <PageShell title="Category"><p className="text-center text-muted-foreground py-8">Category not found</p></PageShell>;

  return (
    <PageShell title={`${category.icon} ${category.name}`}>
      {/* Filter Tabs */}
      <div className="flex bg-secondary rounded-xl p-1 mb-6">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filter === f.value ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="gradient-primary rounded-2xl p-5 mb-6 text-primary-foreground text-center">
        <p className="text-sm opacity-80">Total Spent</p>
        <h2 className="text-3xl font-display font-bold">{formatAmount(totalSpent)}</h2>
        <p className="text-xs opacity-60 mt-1">{filteredExpenses.length} transactions</p>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-card rounded-2xl p-4 shadow-card mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Breakdown</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Bar dataKey="amount" fill={category.color} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Expense List */}
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Transactions</h3>
      <div className="space-y-2">
        {filteredExpenses.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-8">No expenses in this period.</p>
        )}
        {filteredExpenses.map((e) => (
          <div key={e.id} className="bg-card rounded-xl p-3 shadow-card flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{e.description || 'Expense'}</p>
              <p className="text-xs text-muted-foreground">{e.expense_date}</p>
            </div>
            <p className="text-sm font-bold text-foreground">{formatAmount(Number(e.amount))}</p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
