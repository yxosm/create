import { createBrowserClient } from "@supabase/ssr";

// Function to determine the current site URL
const getSiteUrl = () => {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_SITE_URL || 'https://yxosm.github.io/create';
  }
  
  // In the browser, use the current location
  const protocol = window.location.protocol;
  const host = window.location.host;
  const basePath = process.env.NODE_ENV === 'production' ? '/create' : '';
  return `${protocol}//${host}${basePath}`;
};

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: 'pkce',
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
        // Use the actual site URL instead of localhost
        redirectTo: `${getSiteUrl()}/auth/callback`,
      },
    }
  );
