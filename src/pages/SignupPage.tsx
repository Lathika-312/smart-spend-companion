import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const getStrength = () => {
    if (password.length < 6) return { label: 'Weak', color: 'bg-destructive', width: '33%' };
    if (password.length < 10 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) return { label: 'Medium', color: 'bg-warning', width: '66%' };
    return { label: 'Strong', color: 'bg-success', width: '100%' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) { toast.error('Please fill in all required fields'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    setLoading(false);
    if (error) {
      if (error.message.includes('already registered')) toast.error('An account with this email already exists');
      else toast.error(error.message);
    } else {
      toast.success('Account created! Please check your email to verify.');
      navigate('/auth');
    }
  };

  const strength = getStrength();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="h-16 w-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-card">
            <Wallet className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">Create Account</h1>
          <p className="text-sm text-muted-foreground mt-1">Start tracking your expenses</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-sm text-muted-foreground">Full Name</Label>
            <Input placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 h-12 rounded-xl" />
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Email</Label>
            <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 h-12 rounded-xl" />
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Phone (optional)</Label>
            <Input placeholder="+1 234 567 8900" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 h-12 rounded-xl" />
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Password</Label>
            <div className="relative mt-1">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl pr-10"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {password && (
              <div className="mt-2">
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${strength.color}`} style={{ width: strength.width }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{strength.label}</p>
              </div>
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl gradient-primary text-primary-foreground font-semibold text-base">
            {loading ? 'Creating...' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{' '}
          <Link to="/auth" className="text-primary font-semibold hover:underline">Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
