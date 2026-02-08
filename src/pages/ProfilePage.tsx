import { useNavigate } from 'react-router-dom';
import { PageShell } from '@/components/PageShell';
import { BottomNav } from '@/components/BottomNav';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useData';
import { User, Edit2, Lock, Settings, Info, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { ConfirmModal } from '@/components/ConfirmModal';
import { toast } from 'sonner';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { profile } = useProfile();
  const [logoutModal, setLogoutModal] = useState(false);

  const sections = [
    {
      items: [
        { label: 'Personal Details', icon: User, route: '/edit-profile' },
        { label: 'Change Password', icon: Lock, route: '/settings' },
      ],
    },
    {
      items: [
        { label: 'Settings', icon: Settings, route: '/settings' },
        { label: 'About App', icon: Info, route: '/about' },
        { label: 'Contact Support', icon: HelpCircle, route: '/contact-support' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageShell title="Profile" showBack={false}>
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-20 w-20 gradient-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold mb-3">
            {profile.data?.full_name?.[0]?.toUpperCase() || 'U'}
          </div>
          <h2 className="text-lg font-display font-bold text-foreground">{profile.data?.full_name || 'User'}</h2>
          <p className="text-sm text-muted-foreground">{profile.data?.email}</p>
          <p className="text-xs text-muted-foreground">{profile.data?.phone}</p>
          <button
            onClick={() => navigate('/edit-profile')}
            className="mt-3 flex items-center gap-1.5 text-sm text-primary font-semibold hover:underline"
          >
            <Edit2 className="h-3.5 w-3.5" /> Edit Profile
          </button>
        </div>

        {/* Menu Sections */}
        <div className="space-y-4">
          {sections.map((section, si) => (
            <div key={si} className="bg-card rounded-2xl overflow-hidden shadow-card">
              {section.items.map((item, ii) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.route)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 text-sm text-foreground hover:bg-accent/50 transition-colors ${
                    ii < section.items.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={() => setLogoutModal(true)}
          className="w-full mt-6 flex items-center justify-center gap-2 py-3 rounded-xl text-destructive font-semibold hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </PageShell>

      <ConfirmModal open={logoutModal} onClose={() => setLogoutModal(false)} type="logout" onConfirm={async () => { await signOut(); toast.success('Logged out'); }} />
      <BottomNav />
    </div>
  );
}
