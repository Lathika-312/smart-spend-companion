import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Grid3X3, Wallet, Lightbulb, BarChart3, RefreshCw, Settings, Info, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useData';

interface SideDrawerProps {
  open: boolean;
  onClose: () => void;
}

const menuSections = [
  {
    title: 'Profile',
    items: [
      { label: 'My Profile', icon: User, route: '/profile' },
    ],
  },
  {
    title: 'Features',
    items: [
      { label: 'Categories', icon: Grid3X3, route: '/categories' },
      { label: 'Budgets', icon: Wallet, route: '/budgets' },
      { label: 'Smart Insights', icon: Lightbulb, route: '/insights' },
      { label: 'Reports', icon: BarChart3, route: '/analytics' },
      { label: 'Recurring Payments', icon: RefreshCw, route: '/dashboard' },
    ],
  },
  {
    title: 'Settings',
    items: [
      { label: 'Settings', icon: Settings, route: '/settings' },
    ],
  },
  {
    title: 'Support',
    items: [
      { label: 'About App', icon: Info, route: '/about' },
      { label: 'Contact Support', icon: HelpCircle, route: '/contact-support' },
    ],
  },
];

export function SideDrawer({ open, onClose }: SideDrawerProps) {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { profile } = useProfile();

  const handleNav = (route: string) => {
    navigate(route);
    onClose();
  };

  const handleLogout = async () => {
    await signOut();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="h-full w-80 bg-card shadow-elevated overflow-y-auto"
          >
            {/* Header */}
            <div className="gradient-primary p-6 pb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-display font-bold text-primary-foreground">Menu</h2>
                <button onClick={onClose} className="h-8 w-8 rounded-full bg-primary-foreground/20 flex items-center justify-center text-primary-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary-foreground/20 flex items-center justify-center text-primary-foreground font-bold text-lg">
                  {profile.data?.full_name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-semibold text-primary-foreground">{profile.data?.full_name || 'User'}</p>
                  <p className="text-xs text-primary-foreground/70">{profile.data?.email || ''}</p>
                </div>
              </div>
            </div>

            {/* Menu Sections */}
            <div className="p-4 space-y-6">
              {menuSections.map((section) => (
                <div key={section.title}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">{section.title}</p>
                  <div className="space-y-0.5">
                    {section.items.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => handleNav(item.route)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-accent transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-4 w-4 text-muted-foreground" />
                          <span>{item.label}</span>
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Logout */}
            <div className="p-4 border-t border-border">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
