import { motion } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface ExpenseItemProps {
  id: string;
  description: string;
  amount: number;
  time: string;
  categoryIcon: string;
  categoryName: string;
  categoryColor: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ExpenseItem({ id, description, amount, time, categoryIcon, categoryName, categoryColor, onEdit, onDelete }: ExpenseItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between p-3 rounded-xl bg-card hover:shadow-card transition-shadow"
    >
      <div className="flex items-center gap-3">
        <div
          className="h-10 w-10 rounded-xl flex items-center justify-center text-lg"
          style={{ backgroundColor: categoryColor + '20', color: categoryColor }}
        >
          {categoryIcon}
        </div>
        <div>
          <p className="font-medium text-sm text-foreground">{description || categoryName}</p>
          <p className="text-xs text-muted-foreground">{time}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-sm text-destructive">-${amount.toFixed(2)}</span>
        <button onClick={() => onEdit(id)} className="h-7 w-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <Edit2 className="h-3.5 w-3.5" />
        </button>
        <button onClick={() => onDelete(id)} className="h-7 w-7 rounded-lg hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
