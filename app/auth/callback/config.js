// This file ensures the auth callback page is only rendered at runtime
export default {
  runtime: 'edge',
  dynamic: 'force-dynamic',
  // Opt out of static generation
  generateStaticParams: () => []
}
