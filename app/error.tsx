'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertOctagon } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  const handleReset = () => {
    // If on GitHub Pages, ensure proper redirect
    const basePath = window.location.pathname.startsWith('/create') ? '/create' : ''
    if (window.location.pathname !== basePath) {
      window.location.href = basePath || '/'
      return
    }
    reset()
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="mb-8 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
        <AlertOctagon className="text-red-600" />
      </div>
      <h1 className="text-2xl font-bold mb-4">Something went wrong!</h1>
      <p className="mb-8 text-gray-500">
        We apologize for the inconvenience. An unexpected error has occurred.
      </p>
      <Button onClick={handleReset}>
        Try again
      </Button>
    </div>
  )
}
