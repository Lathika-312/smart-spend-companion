import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: 'logout' | 'delete';
}

export function ConfirmModal({ open, onClose, onConfirm, type }: ConfirmModalProps) {
  const isDelete = type === 'delete';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card w-full max-w-sm rounded-2xl p-6 text-center shadow-elevated"
          >
            <div className={`h-16 w-16 rounded-full mx-auto mb-4 flex items-center justify-center ${isDelete ? 'bg-destructive/10' : 'bg-warning/10'}`}>
              {isDelete ? (
                <AlertTriangle className="h-8 w-8 text-destructive" />
              ) : (
                <LogOut className="h-8 w-8 text-warning" />
              )}
            </div>

            <h3 className="text-lg font-display font-bold text-foreground mb-2">
              {isDelete ? 'Delete Account?' : 'Logout?'}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {isDelete
                ? 'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.'
                : 'Are you sure you want to logout?'}
            </p>

            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1 h-11 rounded-xl">
                Cancel
              </Button>
              <Button
                onClick={onConfirm}
                className={`flex-1 h-11 rounded-xl ${isDelete ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' : 'gradient-primary text-primary-foreground'}`}
              >
                {isDelete ? 'Delete' : 'Yes, Logout'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
