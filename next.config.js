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
  // Environment variables for client side - using GitHub repository secrets
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  },
  // Exclude auth callback route from static export
  distDir: 'out',
  exportPathMap: async function (defaultPathMap) {
    // Remove auth callback from static export
    delete defaultPathMap['/auth/callback'];
    
    return defaultPathMap;
  }
}

module.exports = nextConfig
