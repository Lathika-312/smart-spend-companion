import { useState } from 'react';
import { PageShell } from '@/components/PageShell';
import { useProfile } from '@/hooks/useData';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function EditProfilePage() {
  const { profile, updateProfile } = useProfile();
  const [fullName, setFullName] = useState(profile.data?.full_name || '');
  const [email, setEmail] = useState(profile.data?.email || '');
  const [phone, setPhone] = useState(profile.data?.phone || '');
  const [dob, setDob] = useState(profile.data?.dob || '');
  const [gender, setGender] = useState(profile.data?.gender || '');
  const [address, setAddress] = useState(profile.data?.address || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    updateProfile.mutate(
      { full_name: fullName, phone, dob: dob || null, gender: gender || null, address },
      {
        onSuccess: () => { toast.success('Profile updated!'); setLoading(false); },
        onError: () => { toast.error('Failed to update'); setLoading(false); },
      }
    );
  };

  return (
    <PageShell title="Edit Profile">
      {/* Avatar */}
      <div className="flex flex-col items-center mb-6">
        <div className="h-20 w-20 gradient-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold mb-2">
          {fullName[0]?.toUpperCase() || 'U'}
        </div>
        <button className="text-xs text-primary font-semibold">Change Photo</button>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-sm text-muted-foreground">Full Name</Label>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 h-12 rounded-xl" />
        </div>
        <div>
          <Label className="text-sm text-muted-foreground">Email</Label>
          <Input value={email} disabled className="mt-1 h-12 rounded-xl opacity-50" />
        </div>
        <div>
          <Label className="text-sm text-muted-foreground">Phone</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 h-12 rounded-xl" />
        </div>
        <div>
          <Label className="text-sm text-muted-foreground">Date of Birth</Label>
          <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="mt-1 h-12 rounded-xl" />
        </div>
        <div>
          <Label className="text-sm text-muted-foreground">Gender</Label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="mt-1 h-12 w-full rounded-xl border border-input bg-background px-3 text-foreground"
          >
            <option value="">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <Label className="text-sm text-muted-foreground">Address</Label>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 h-12 rounded-xl" />
        </div>

        <Button onClick={handleSave} disabled={loading} className="w-full h-12 rounded-xl gradient-primary text-primary-foreground font-semibold">
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>

        <button className="w-full text-center text-xs text-destructive hover:underline mt-2">Delete Account</button>
      </div>
    </PageShell>
  );
}
