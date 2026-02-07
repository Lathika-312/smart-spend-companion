import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface InsightCardProps {
  title: string;
  description: string;
  type: 'info' | 'warning' | 'positive' | 'negative';
}

const iconMap = {
  info: Lightbulb,
  warning: AlertCircle,
  positive: TrendingUp,
  negative: TrendingDown,
};

const colorMap = {
  info: 'bg-primary/10 text-primary',
  warning: 'bg-warning/10 text-warning',
  positive: 'bg-success/10 text-success',
  negative: 'bg-destructive/10 text-destructive',
};

export function InsightCard({ title, description, type }: InsightCardProps) {
  const Icon = iconMap[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl p-4 shadow-card"
    >
      <div className="flex items-start gap-3">
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${colorMap[type]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold text-sm text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}
