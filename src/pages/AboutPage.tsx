import { PageShell } from '@/components/PageShell';
import { Smartphone, Star, BarChart3, Wallet, Lightbulb, Shield } from 'lucide-react';

const features = [
  { icon: Wallet, label: 'Expense Tracking', desc: 'Log daily expenses with categories and notes' },
  { icon: BarChart3, label: 'Analytics & Reports', desc: 'Weekly and monthly spending charts' },
  { icon: Lightbulb, label: 'Smart Insights', desc: 'AI-powered spending pattern analysis' },
  { icon: Shield, label: 'Budget Alerts', desc: 'Get notified when nearing budget limits' },
];

export default function AboutPage() {
  return (
    <PageShell title="About App">
      <div className="text-center mb-8">
        <div className="h-20 w-20 rounded-2xl gradient-primary mx-auto flex items-center justify-center mb-4 shadow-elevated">
          <Smartphone className="h-10 w-10 text-primary-foreground" />
        </div>
        <h2 className="text-xl font-display font-bold text-foreground">Smart Expense Tracker</h2>
        <p className="text-sm text-muted-foreground mt-1">Version 1.0.0</p>
      </div>

      <div className="bg-card rounded-2xl p-5 shadow-card mb-6">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Smart Expense Tracker helps you take control of your finances by tracking daily expenses, 
          setting budgets, and providing AI-powered insights into your spending patterns. 
          Stay on top of your money with beautiful charts and smart alerts.
        </p>
      </div>

      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Key Features</h3>
      <div className="space-y-3 mb-6">
        {features.map((f) => (
          <div key={f.label} className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
              <f.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{f.label}</p>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-2xl p-5 shadow-card text-center">
        <h3 className="text-sm font-semibold text-foreground mb-1">Developed by</h3>
        <p className="text-sm text-muted-foreground">Smart Finance Team</p>
        <p className="text-xs text-muted-foreground mt-1">© 2026 Smart Expense Tracker. All rights reserved.</p>
      </div>
    </PageShell>
  );
}
