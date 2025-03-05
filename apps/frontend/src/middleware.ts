import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)'
]);

export default clerkMiddleware(async (auth, request) => {
  console.log('Middleware processing request:', request.url);
  const { userId } = await auth();
  
  if (!isPublicRoute(request)) {
    console.log('Protected route accessed:', request.url);
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }
  } else {
    console.log('Public route accessed:', request.url);
  }
}, { debug: true }); // Enable debug mode for all environments temporarily

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}; 