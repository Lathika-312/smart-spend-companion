import { useState } from 'react';
import { PageShell } from '@/components/PageShell';
import { useCategories } from '@/hooks/useData';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const EMOJI_OPTIONS = ['🍔', '✈️', '🛍️', '📄', '🏥', '🏠', '📦', '🎮', '🎬', '💊', '🚗', '📚', '💰', '🎁', '🏋️'];
const COLOR_OPTIONS = ['#EF4444', '#3B82F6', '#8B5CF6', '#F59E0B', '#10B981', '#6366F1', '#EC4899', '#14B8A6', '#F97316'];

export default function CategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('📦');
  const [color, setColor] = useState('#3B82F6');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openAdd = () => { setEditId(null); setName(''); setIcon('📦'); setColor('#3B82F6'); setModalOpen(true); };
  const openEdit = (cat: any) => { setEditId(cat.id); setName(cat.name); setIcon(cat.icon); setColor(cat.color); setModalOpen(true); };

  const handleSave = () => {
    if (!name.trim()) { toast.error('Enter a category name'); return; }
    if (editId) {
      updateCategory.mutate({ id: editId, name, icon, color }, { onSuccess: () => { toast.success('Updated'); setModalOpen(false); } });
    } else {
      addCategory.mutate({ name, icon, color }, { onSuccess: () => { toast.success('Category added'); setModalOpen(false); } });
    }
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteCategory.mutate(deleteId, { onSuccess: () => { toast.success('Deleted'); setDeleteId(null); } });
  };

  return (
    <PageShell title="Categories" rightAction={
      <button onClick={openAdd} className="h-9 w-9 rounded-xl hover:bg-secondary flex items-center justify-center text-primary">
        <Plus className="h-5 w-5" />
      </button>
    }>
      <div className="grid grid-cols-3 gap-3">
        {categories.data?.map((cat) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl p-4 text-center shadow-card relative group"
          >
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
              <button onClick={() => openEdit(cat)} className="h-6 w-6 rounded-lg bg-secondary flex items-center justify-center">
                <Edit2 className="h-3 w-3 text-muted-foreground" />
              </button>
              <button onClick={() => setDeleteId(cat.id)} className="h-6 w-6 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Trash2 className="h-3 w-3 text-destructive" />
              </button>
            </div>
            <div className="h-12 w-12 rounded-xl mx-auto flex items-center justify-center text-2xl mb-2" style={{ backgroundColor: cat.color + '20' }}>
              {cat.icon}
            </div>
            <p className="text-xs font-medium text-foreground">{cat.name}</p>
          </motion.div>
        ))}

        <button onClick={openAdd} className="bg-accent/50 rounded-2xl p-4 text-center border-2 border-dashed border-border hover:border-primary transition-colors">
          <div className="h-12 w-12 rounded-xl mx-auto flex items-center justify-center text-muted-foreground mb-2">
            <Plus className="h-6 w-6" />
          </div>
          <p className="text-xs font-medium text-muted-foreground">Add New</p>
        </button>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4" onClick={() => setModalOpen(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()} className="bg-card w-full max-w-sm rounded-2xl p-6 shadow-elevated">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-foreground">{editId ? 'Edit' : 'Add'} Category</h3>
                <button onClick={() => setModalOpen(false)} className="text-muted-foreground"><X className="h-4 w-4" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 h-11 rounded-xl" />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Icon</Label>
                  <div className="flex flex-wrap gap-2">
                    {EMOJI_OPTIONS.map((e) => (
                      <button key={e} onClick={() => setIcon(e)}
                        className={`h-10 w-10 rounded-xl flex items-center justify-center text-lg border-2 ${icon === e ? 'border-primary bg-accent' : 'border-transparent hover:bg-secondary'}`}>
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Color</Label>
                  <div className="flex gap-2">
                    {COLOR_OPTIONS.map((c) => (
                      <button key={c} onClick={() => setColor(c)}
                        className={`h-8 w-8 rounded-full border-2 ${color === c ? 'border-foreground scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
                <Button onClick={handleSave} className="w-full h-11 rounded-xl gradient-primary text-primary-foreground font-semibold">
                  {editId ? 'Update' : 'Add'} Category
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4" onClick={() => setDeleteId(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()} className="bg-card w-full max-w-xs rounded-2xl p-6 text-center shadow-elevated">
              <h3 className="font-display font-bold mb-2 text-foreground">Delete Category?</h3>
              <p className="text-sm text-muted-foreground mb-4">This will also remove it from your expenses.</p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setDeleteId(null)} className="flex-1 rounded-xl">Cancel</Button>
                <Button onClick={handleDelete} className="flex-1 rounded-xl bg-destructive text-destructive-foreground">Delete</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}
