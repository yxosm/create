'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../utils/supabase/client'

// Configure this page to be dynamically rendered
export const dynamic = 'force-dynamic'

export default function AuthCallback() {
  const router = useRouter()
  
  useEffect(() => {
    // Get code from URL
    const code = new URL(window.location.href).searchParams.get('code')
    
    async function handleCallback() {
      if (code) {
        try {
          const supabase = createClient()
          await supabase.auth.exchangeCodeForSession(code)
          router.push('/dashboard') // Or your post-login redirect page
        } catch (error) {
          console.error('Error exchanging code for session:', error)
          router.push('/') // Redirect to home on error
        }
      } else {
        // No code in URL, redirect to home
        router.push('/')
      }
    }

    handleCallback()
  }, [router])

  return <div className="flex justify-center p-8">Processing login...</div>
}
