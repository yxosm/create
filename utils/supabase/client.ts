import { createBrowserClient } from "@supabase/ssr"

const getBasePath = () => process.env.NODE_ENV === 'production' ? '/create' : ''

export const createClient = () => {
  // Return undefined during SSR to prevent window access
  if (typeof window === 'undefined') {
    return undefined
  }

  const basePath = window.location.pathname.startsWith('/create') ? '/create' : ''

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: 'pkce',
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
      },
      cookies: {
        name: 'sb-auth',
        lifetime: 60 * 60 * 8,
        domain: window.location.hostname,
        path: basePath || '/',
        sameSite: 'lax'
      },
      global: {
        fetch: fetch.bind(globalThis)
      }
    }
  )
}
