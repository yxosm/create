'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

export default function AuthCallback() {
  const router = useRouter()
  
  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )

    // Get code from URL
    const code = new URL(window.location.href).searchParams.get('code')
    
    async function handleCallback() {
      if (code) {
        await supabase.auth.exchangeCodeForSession(code)
        router.push('/dashboard') // Or your post-login redirect page
      }
    }

    handleCallback()
  }, [router])

  return <div className="flex justify-center p-8">Processing login...</div>
}
