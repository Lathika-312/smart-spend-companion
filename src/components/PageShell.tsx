import { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageShellProps {
  title: string;
  children: ReactNode;
  showBack?: boolean;
  rightAction?: ReactNode;
}

export function PageShell({ title, children, showBack = true, rightAction }: PageShellProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-lg border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-xl hover:bg-secondary flex items-center justify-center text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <h1 className="text-lg font-display font-bold text-foreground">{title}</h1>
        </div>
        {rightAction}
      </header>
      <main className="p-4 pb-24 max-w-lg mx-auto">
        {children}
      </main>
    </div>
  );
}
