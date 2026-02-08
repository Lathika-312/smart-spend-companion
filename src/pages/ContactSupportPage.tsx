import { PageShell } from '@/components/PageShell';
import { Mail, Phone, MessageCircle, HeartHandshake } from 'lucide-react';

export default function ContactSupportPage() {
  return (
    <PageShell title="Contact Support">
      <div className="text-center mb-8">
        <div className="h-16 w-16 rounded-full bg-accent mx-auto flex items-center justify-center mb-3">
          <HeartHandshake className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-lg font-display font-bold text-foreground">We're here to help you</h2>
        <p className="text-sm text-muted-foreground mt-1">Reach out to us through any of the channels below</p>
      </div>

      <div className="space-y-3">
        <a href="mailto:support@smartexpense.app" className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-4 hover:bg-accent/30 transition-colors">
          <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Email Support</p>
            <p className="text-xs text-muted-foreground">support@smartexpense.app</p>
          </div>
        </a>

        <a href="tel:+1234567890" className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-4 hover:bg-accent/30 transition-colors">
          <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
            <Phone className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Phone Support</p>
            <p className="text-xs text-muted-foreground">+1 (234) 567-890</p>
          </div>
        </a>

        <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-4 hover:bg-accent/30 transition-colors">
          <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">WhatsApp</p>
            <p className="text-xs text-muted-foreground">Chat with us on WhatsApp</p>
          </div>
        </a>
      </div>
    </PageShell>
  );
}
