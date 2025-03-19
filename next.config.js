/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/create' : '',
  images: {
    unoptimized: true,
  },
  // Skip TypeScript errors
  typescript: {
    ignoreBuildErrors: true,
  },
  // Skip ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Environment variables for client side
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cosaqwjdfwitkrhgppbh.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvc2Fxd2pkZndpdGtyaGdwcGJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NTg1MTQsImV4cCI6MjA1NzQzNDUxNH0.PJtn11iM2nc20vcQGUEYVcWZol1Vvzg1EOs1VtV_FlY'
  }
}

module.exports = nextConfig
