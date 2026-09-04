import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { clearAuthBypass } from '@/lib/authBypass';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Settings = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    clearAuthBypass();
    await supabase.auth.signOut();
    toast.success('Signed out');
    navigate('/auth/login');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-4xl">Settings</h1>
        <p className="mt-2 text-muted-foreground">How Syaf Personal Shopper appears and receives Telegram orders.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border bg-card p-6">
          <h2 className="font-serif text-2xl">Shopper profile</h2>
          <div className="mt-5 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Display name</Label>
              <Input id="name" defaultValue="Syaf" className="rounded-xl bg-background" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="handle">Public handle</Label>
              <Input id="handle" defaultValue="@syaf.personalshopper" className="rounded-xl bg-background" />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-6">
          <h2 className="font-serif text-2xl">Telegram</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Orders are collected from your Telegram bot and shown in this workspace.
          </p>
          <div className="mt-5 rounded-xl border border-primary/15 bg-background p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Bot connected</p>
                <p className="text-xs text-muted-foreground">@syafshopper_bot</p>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-6">
          <h2 className="font-serif text-2xl">Alerts</h2>
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">New Telegram order</p>
                <p className="text-xs text-muted-foreground">Ping when a client sends a new request</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Payment received</p>
                <p className="text-xs text-muted-foreground">Notify when a quote is marked paid</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-6">
          <h2 className="font-serif text-2xl">Session</h2>
          <p className="mt-2 text-sm text-muted-foreground">Sign out of this workspace on this device.</p>
          <Button variant="outline" className="mt-5 rounded-xl" onClick={handleLogout}>
            Sign out
          </Button>
        </section>
      </div>
    </div>
  );
};

export default Settings;
