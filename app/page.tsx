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
          
          // Use window.location.replace for hard redirect to handle GitHub Pages base path
          window.location.replace('/create')
        } catch (error) {
          console.error('Error exchanging code for session:', error)
          window.location.replace('/create')
        }
      } else {
        window.location.replace('/create')
      }
    }

    handleCallback()
  }, [router])

  return <div className="flex justify-center p-8">Processing login...</div>
}
