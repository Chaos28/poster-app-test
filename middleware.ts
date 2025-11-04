import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Only handle /api/* paths
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Skip Next.js internal API routes
    if (request.nextUrl.pathname.startsWith('/api/_next')) {
      return NextResponse.next()
    }

    const apiBaseUrl = process.env.NEXT_PROXY_FALLBACK || 'https://posters.aiml.cgify.com'

    // Create new URL for the backend
    const url = new URL(request.nextUrl.pathname + request.nextUrl.search, apiBaseUrl)

    // Create a new request with the same method, headers, and body
    const headers = new Headers(request.headers)

    // Add necessary headers
    headers.set('x-forwarded-host', request.headers.get('host') || '')
    headers.set('x-forwarded-proto', request.nextUrl.protocol.replace(':', ''))

    return NextResponse.rewrite(url, {
      request: {
        headers,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
