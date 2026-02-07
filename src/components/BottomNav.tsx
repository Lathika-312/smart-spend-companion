import { Home, BarChart3, Lightbulb, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const tabs = [
  { label: 'Home', icon: Home, route: '/dashboard' },
  { label: 'Analytics', icon: BarChart3, route: '/analytics' },
  { label: 'Insights', icon: Lightbulb, route: '/insights' },
  { label: 'Profile', icon: User, route: '/profile' },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-lg border-t border-border">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const active = location.pathname === tab.route;
          return (
            <button
              key={tab.route}
              onClick={() => navigate(tab.route)}
              className="flex flex-col items-center gap-0.5 px-4 py-1 relative"
            >
              {active && (
                <motion.div
                  layoutId="bottomnav-indicator"
                  className="absolute -top-2 w-8 h-1 rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <tab.icon className={`h-5 w-5 transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`text-[10px] font-medium ${active ? 'text-primary' : 'text-muted-foreground'}`}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
