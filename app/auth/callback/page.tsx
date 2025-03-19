'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'

// Add export config to ensure this page is always dynamically rendered
export const dynamic = 'force-dynamic'

export default function AuthCallback() {
  const router = useRouter()
  
  useEffect(() => {
    const handleCallback = async (supabase: SupabaseClient) => {
      const code = new URL(window.location.href).searchParams.get('code')
      
      if (code) {
        try {
          await supabase.auth.exchangeCodeForSession(code)
          window.location.replace('/create')
        } catch (error) {
          console.error('Error exchanging code for session:', error)
          window.location.replace('/create')
        }
      } else {
        window.location.replace('/create')
      }
    }

    const supabase = createClient()
    if (!supabase) {
      window.location.replace('/create')
      return
    }

    handleCallback(supabase)
  }, [router])

  return <div className="flex justify-center p-8">Processing login...</div>
}
