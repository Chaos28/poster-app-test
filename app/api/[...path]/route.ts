import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PROXY_FALLBACK || 'https://posters.aiml.cgify.com'

async function handleRequest(request: NextRequest, { params }: { params: { path: string[] } }) {
  const pathSegments = params.path
  const pathString = pathSegments.join('/')
  const url = `${API_BASE_URL}/api/${pathString}`

  const searchParams = new URL(request.url).searchParams
  const queryString = searchParams.toString()
  const fullUrl = queryString ? `${url}?${queryString}` : url

  console.log('[Proxy] Request:', request.method, fullUrl)

  try {
    // Prepare headers
    const headers: Record<string, string> = {}

    // Copy relevant headers from the original request
    const headersToForward = [
      'content-type',
      'authorization',
      'cookie',
      'accept',
      'accept-language',
      'user-agent',
    ]

    headersToForward.forEach((header) => {
      const value = request.headers.get(header)
      if (value) {
        headers[header] = value
      }
    })

    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method: request.method,
      headers,
      credentials: 'include',
    }

    // Add body for POST, PUT, PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      const body = await request.text()
      if (body) {
        fetchOptions.body = body
      }
    }

    // Make the request to the backend
    const response = await fetch(fullUrl, fetchOptions)

    // Get response data
    const responseData = await response.text()

    // Prepare response headers
    const responseHeaders = new Headers()

    // Copy relevant headers from backend response
    const headersToReturn = [
      'content-type',
      'set-cookie',
      'cache-control',
      'expires',
      'etag',
    ]

    headersToReturn.forEach((header) => {
      const value = response.headers.get(header)
      if (value) {
        responseHeaders.set(header, value)
      }
    })

    // Add CORS headers to allow credentials
    responseHeaders.set('Access-Control-Allow-Credentials', 'true')
    responseHeaders.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*')
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie')

    return new NextResponse(responseData, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    })
  } catch (error) {
    console.error('[Proxy] Error:', error)
    return NextResponse.json(
      { error: 'Failed to proxy request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest, context: { params: { path: string[] } }) {
  return handleRequest(request, context)
}

export async function POST(request: NextRequest, context: { params: { path: string[] } }) {
  return handleRequest(request, context)
}

export async function PUT(request: NextRequest, context: { params: { path: string[] } }) {
  return handleRequest(request, context)
}

export async function DELETE(request: NextRequest, context: { params: { path: string[] } }) {
  return handleRequest(request, context)
}

export async function PATCH(request: NextRequest, context: { params: { path: string[] } }) {
  return handleRequest(request, context)
}

export async function OPTIONS(request: NextRequest) {
  const headers = new Headers()
  headers.set('Access-Control-Allow-Credentials', 'true')
  headers.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*')
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie')
  headers.set('Access-Control-Max-Age', '86400')

  return new NextResponse(null, {
    status: 204,
    headers,
  })
}
