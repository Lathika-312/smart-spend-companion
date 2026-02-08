import { useState, useMemo } from 'react';
import { PageShell } from '@/components/PageShell';
import { BottomNav } from '@/components/BottomNav';
import { useExpenses, useCategories } from '@/hooks/useData';
import { useCurrency } from '@/contexts/CurrencyContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InsightCard } from '@/components/InsightCard';
import { toast } from 'sonner';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const { allExpenses } = useExpenses();
  const { categories } = useCategories();
  const { formatAmount, symbol } = useCurrency();

  const weeklyData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((name, i) => {
      const total = allExpenses.data
        ?.filter((e) => {
          const d = new Date(e.expense_date);
          return d.getDay() === (i + 1) % 7;
        })
        .reduce((s, e) => s + Number(e.amount), 0) ?? 0;
      return { name, total };
    });
  }, [allExpenses.data]);

  const monthlyData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((name, i) => {
      const total = allExpenses.data
        ?.filter((e) => new Date(e.expense_date).getMonth() === i)
        .reduce((s, e) => s + Number(e.amount), 0) ?? 0;
      return { name, total };
    });
  }, [allExpenses.data]);

  const categoryData = useMemo(() => {
    const map: Record<string, { name: string; value: number; color: string }> = {};
    allExpenses.data?.forEach((e) => {
      const cat = e.categories;
      const key = cat?.id || 'other';
      if (!map[key]) map[key] = { name: cat?.name || 'Other', value: 0, color: cat?.color || '#6B7280' };
      map[key].value += Number(e.amount);
    });
    return Object.values(map).sort((a, b) => b.value - a.value);
  }, [allExpenses.data]);

  const topCategory = categoryData[0];
  const totalSpent = categoryData.reduce((s, c) => s + c.value, 0);

  const handleDownloadPDF = async () => {
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');

      const doc = new jsPDF();
      const now = new Date();
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);

      const weekExpenses = (allExpenses.data || []).filter(
        (e) => new Date(e.expense_date) >= weekAgo
      );

      doc.setFontSize(18);
      doc.text('Weekly Expense Report', 14, 22);
      doc.setFontSize(10);
      doc.text(`${weekAgo.toLocaleDateString()} — ${now.toLocaleDateString()}`, 14, 30);

      // Category totals
      const catTotals: Record<string, number> = {};
      weekExpenses.forEach((e) => {
        const name = e.categories?.name || 'Other';
        catTotals[name] = (catTotals[name] || 0) + Number(e.amount);
      });

      autoTable(doc, {
        startY: 38,
        head: [['Category', 'Total']],
        body: Object.entries(catTotals).map(([cat, amt]) => [cat, `${symbol}${amt.toFixed(2)}`]),
      });

      const finalY = (doc as any).lastAutoTable?.finalY || 60;

      // Daily breakdown
      autoTable(doc, {
        startY: finalY + 10,
        head: [['Date', 'Description', 'Category', 'Amount']],
        body: weekExpenses.map((e) => [
          e.expense_date,
          e.description || '-',
          e.categories?.name || 'Other',
          `${symbol}${Number(e.amount).toFixed(2)}`,
        ]),
      });

      const total = weekExpenses.reduce((s, e) => s + Number(e.amount), 0);
      const lastY = (doc as any).lastAutoTable?.finalY || 100;
      doc.setFontSize(12);
      doc.text(`Total Weekly Spend: ${symbol}${total.toFixed(2)}`, 14, lastY + 10);

      doc.save('weekly-expense-report.pdf');
      toast.success('PDF downloaded!');
    } catch {
      toast.error('Failed to generate PDF');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PageShell title="Analytics" rightAction={
        <Button variant="ghost" size="icon" className="rounded-xl" onClick={handleDownloadPDF}>
          <Download className="h-4 w-4" />
        </Button>
      }>
        {/* Period Toggle */}
        <div className="flex bg-secondary rounded-xl p-1 mb-6">
          {(['weekly', 'monthly'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${
                period === p ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Bar Chart */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-2xl p-4 shadow-card mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">{period === 'weekly' ? 'Weekly' : 'Monthly'} Spending</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={period === 'weekly' ? weeklyData : monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip />
              <Bar dataKey="total" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <div className="bg-card rounded-2xl p-4 shadow-card mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">By Category</h3>
          {categoryData.length > 0 ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={categoryData} dataKey="value" cx="50%" cy="50%" outerRadius={60} innerRadius={35}>
                    {categoryData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 flex-1">
                {categoryData.slice(0, 5).map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-foreground">{cat.name}</span>
                    </div>
                    <span className="text-muted-foreground">{formatAmount(cat.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground text-sm py-6">No data yet</p>
          )}
        </div>

        {/* Insights */}
        <div className="space-y-3">
          {topCategory && (
            <InsightCard title="Highest Spending" description={`${topCategory.name}: ${formatAmount(topCategory.value)}`} type="negative" />
          )}
          <InsightCard title="Total Spent" description={`${formatAmount(totalSpent)} total across all categories`} type="info" />
        </div>

        {/* Download Button */}
        <Button onClick={handleDownloadPDF} className="w-full mt-6 h-11 rounded-xl gradient-primary text-primary-foreground font-semibold">
          <Download className="h-4 w-4 mr-2" />
          Download Weekly Report (PDF)
        </Button>
      </PageShell>
      <BottomNav />
    </div>
  );
}
