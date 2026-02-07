import { PageShell } from '@/components/PageShell';
import { Info, HelpCircle, FileText, Shield, BookOpen, ChevronRight } from 'lucide-react';

const items = [
  { label: 'About App', icon: Info, description: 'Smart Expense Tracker v1.0 — Track your finances smartly with AI-powered insights.' },
  { label: 'Contact Support', icon: HelpCircle, description: 'support@smartexpense.app' },
  { label: 'FAQs', icon: BookOpen, description: 'Common questions about using the app' },
  { label: 'Privacy Policy', icon: Shield, description: 'How we handle your data' },
  { label: 'Terms & Conditions', icon: FileText, description: 'App usage terms' },
];

export default function SupportPage() {
  return (
    <PageShell title="Support">
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="bg-card rounded-2xl p-4 shadow-card">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
                <item.icon className="h-5 w-5 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm text-foreground">{item.label}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
