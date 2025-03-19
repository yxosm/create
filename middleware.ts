import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  try {
    // Check if we're in production and need the /create prefix
    const basePath = process.env.NODE_ENV === 'production' ? '/create' : ''
    
    // Get the pathname without the basePath
    const pathname = request.nextUrl.pathname.replace(basePath, '')
    
    // Create client
    const { supabase, response } = createClient(request)
    
    // Check auth state
    await supabase.auth.getSession()
    
    // Special handling for auth callback
    if (pathname === '/auth/callback') {
      // Make sure we keep any query parameters
      const redirectUrl = new URL(
        `${basePath}/auth/callback${request.nextUrl.search}`,
        request.url
      )
      return NextResponse.redirect(redirectUrl)
    }

    return response
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - .well-known folder (for security validation files)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|\\.well-known).*)',
  ],
}
