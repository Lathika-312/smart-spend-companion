import { PageShell } from '@/components/PageShell';
import { Smartphone } from 'lucide-react';

export default function AboutPage() {
  return (
    <PageShell title="About App">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-20 w-20 rounded-2xl gradient-primary mx-auto flex items-center justify-center mb-6 shadow-elevated">
          <Smartphone className="h-10 w-10 text-primary-foreground" />
        </div>
        <h2 className="text-xl font-display font-bold text-foreground mb-1">Smart Expense Tracker</h2>
        <p className="text-sm text-muted-foreground mb-8">Version 1.0.0</p>

        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
          Developed by Lathika S
        </p>
      </div>
    </PageShell>
  );
}
