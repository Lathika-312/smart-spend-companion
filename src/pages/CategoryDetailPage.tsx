import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { PageShell } from '@/components/PageShell';
import { useExpenses, useCategories } from '@/hooks/useData';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { allExpenses } = useExpenses();
  const { categories } = useCategories();

  const category = useMemo(() => categories.data?.find((c) => c.id === id), [categories.data, id]);

  const categoryExpenses = useMemo(() => {
    return (allExpenses.data || []).filter((e) => e.category_id === id).sort((a, b) => b.expense_date.localeCompare(a.expense_date));
  }, [allExpenses.data, id]);

  const totalSpent = useMemo(() => categoryExpenses.reduce((s, e) => s + Number(e.amount), 0), [categoryExpenses]);

  const weeklyData = useMemo(() => {
    const map: Record<string, number> = {};
    categoryExpenses.forEach((e) => {
      const d = new Date(e.expense_date);
      const week = `W${Math.ceil(d.getDate() / 7)}`;
      map[week] = (map[week] || 0) + Number(e.amount);
    });
    return Object.entries(map).map(([name, amount]) => ({ name, amount })).slice(0, 5);
  }, [categoryExpenses]);

  if (!category) return <PageShell title="Category"><p className="text-center text-muted-foreground py-8">Category not found</p></PageShell>;

  return (
    <PageShell title={`${category.icon} ${category.name}`}>
      {/* Summary */}
      <div className="gradient-primary rounded-2xl p-5 mb-6 text-primary-foreground text-center">
        <p className="text-sm opacity-80">Total Spent</p>
        <h2 className="text-3xl font-display font-bold">${totalSpent.toFixed(2)}</h2>
        <p className="text-xs opacity-60 mt-1">{categoryExpenses.length} transactions</p>
      </div>

      {/* Chart */}
      {weeklyData.length > 0 && (
        <div className="bg-card rounded-2xl p-4 shadow-card mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Weekly Breakdown</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={weeklyData}>
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
        {categoryExpenses.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-8">No expenses in this category yet.</p>
        )}
        {categoryExpenses.map((e) => (
          <div key={e.id} className="bg-card rounded-xl p-3 shadow-card flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{e.description || 'Expense'}</p>
              <p className="text-xs text-muted-foreground">{e.expense_date}</p>
            </div>
            <p className="text-sm font-bold text-foreground">${Number(e.amount).toFixed(2)}</p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
