// This is a route segment config file that ensures the auth callback is dynamically rendered
export const dynamic = 'force-dynamic'
export const runtime = 'edge'

// This route will be rendered at request time, not build time
export async function generateStaticParams() {
  return []
}
