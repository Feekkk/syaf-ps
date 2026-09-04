import { useEffect, useState, type CSSProperties } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layouts/AppSidebar';
import { User } from '@supabase/supabase-js';
import { hasAuthBypass } from '@/lib/authBypass';

const TelegramMark = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
    <path
      fill="currentColor"
      d="M21.5 4.3 18.7 20c-.2.9-.8 1.1-1.6.7l-4.5-3.3-2.2 2.1c-.2.2-.4.4-.9.4l.3-4.7 8.5-7.7c.4-.3 0-.5-.5-.2l-10.5 6.6-4.5-1.4c-1-.3-1-.9.2-1.4L20.3 3.5c.8-.3 1.5.2 1.2.8Z"
    />
  </svg>
);

const AppLayout = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user && !hasAuthBypass()) {
        navigate('/auth/login');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session?.user && !hasAuthBypass()) {
        navigate('/auth/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user && !hasAuthBypass()) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen style={{ '--sidebar-width': '17.5rem' } as CSSProperties}>
      <div className="flex h-svh w-full overflow-hidden">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <header className="shrink-0 border-b bg-background/90 backdrop-blur">
            <div className="flex h-16 items-center justify-end px-6">
              <div className="flex items-center gap-2 rounded-full border border-primary/15 bg-card px-3 py-1.5 text-xs text-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <TelegramMark />
                Telegram connected
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-[1400px] p-6 md:p-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
