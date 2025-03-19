'use client'

import { useEffect } from 'react'
import { AlertOctagon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  const handleReset = () => {
    const basePath = window.location.pathname.startsWith('/create') ? '/create' : ''
    if (window.location.pathname !== basePath) {
      window.location.href = basePath || '/'
      return
    }
    reset()
  }

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
          <div className="mb-8 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertOctagon className="text-red-600" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Critical Error</h1>
          <p className="mb-8 text-gray-500">
            A critical error has occurred. Please try refreshing the page.
          </p>
          <Button onClick={handleReset}>
            Refresh Page
          </Button>
        </div>
      </body>
    </html>
  )
}
