import { useState } from 'react';
import { PageShell } from '@/components/PageShell';
import { useProfile } from '@/hooks/useData';
import { useAuth } from '@/contexts/AuthContext';
import { Switch } from '@/components/ui/switch';
import { ConfirmModal } from '@/components/ConfirmModal';
import { toast } from 'sonner';
import { Sun, Moon, Bell, DollarSign, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const { profile, updateProfile } = useProfile();
  const { signOut } = useAuth();
  const [deleteModal, setDeleteModal] = useState(false);

  const currencies = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD'];
  const isDark = profile.data?.theme === 'dark';

  const setTheme = (theme: string) => {
    updateProfile.mutate({ theme });
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <PageShell title="Settings">
      <div className="space-y-4">
        {/* Theme */}
        <div className="bg-card rounded-2xl p-4 shadow-card">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Theme</p>
          <div className="flex gap-3">
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors ${
                !isDark ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-accent'
              }`}
            >
              <Sun className="h-4 w-4" />
              Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors ${
                isDark ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-accent'
              }`}
            >
              <Moon className="h-4 w-4" />
              Dark
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card rounded-2xl p-4 shadow-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Notifications</span>
            </div>
            <Switch
              checked={profile.data?.notifications_enabled ?? true}
              onCheckedChange={(v) => updateProfile.mutate({ notifications_enabled: v })}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 ml-7">Get alerts when spending exceeds 80% of budget</p>
        </div>

        {/* Currency */}
        <div className="bg-card rounded-2xl p-4 shadow-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Currency</span>
            </div>
            <select
              value={profile.data?.currency || 'USD'}
              onChange={(e) => updateProfile.mutate({ currency: e.target.value })}
              className="bg-secondary text-foreground text-sm rounded-lg px-3 py-1.5 border-none"
            >
              {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <p className="text-xs text-muted-foreground mt-2 ml-7">Updates all amounts across the app</p>
        </div>

        {/* Delete Account */}
        <button
          onClick={() => setDeleteModal(true)}
          className="w-full flex items-center gap-3 p-4 rounded-2xl bg-destructive/5 text-destructive text-sm font-semibold hover:bg-destructive/10 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          Delete Account
        </button>
      </div>

      <ConfirmModal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        type="delete"
        onConfirm={async () => {
          toast.info('Account deletion would be processed here');
          setDeleteModal(false);
        }}
      />
    </PageShell>
  );
}
