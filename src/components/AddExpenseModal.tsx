import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddExpenseModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { amount: number; description: string; category_id: string; expense_date: string }) => void;
  categories: { id: string; name: string; icon: string; color: string }[];
}

export function AddExpenseModal({ open, onClose, onSubmit, categories }: AddExpenseModalProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = () => {
    if (!amount || !categoryId) return;
    onSubmit({ amount: parseFloat(amount), description, category_id: categoryId, expense_date: date });
    setAmount('');
    setDescription('');
    setCategoryId('');
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card w-full max-w-md rounded-2xl p-6 shadow-elevated"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-display font-bold text-foreground">Add Expense</h3>
              <button onClick={onClose} className="h-8 w-8 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Amount</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 text-lg font-semibold"
                />
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Description</Label>
                <Input
                  placeholder="What was this for?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Date</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">Category</Label>
                <div className="grid grid-cols-4 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryId(cat.id)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-colors ${
                        categoryId === cat.id ? 'border-primary bg-accent' : 'border-transparent hover:bg-secondary'
                      }`}
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <span className="text-[10px] text-muted-foreground">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={handleSubmit} className="w-full gradient-primary text-primary-foreground font-semibold h-12 rounded-xl">
                Add Expense
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
