# Vercel Deployment Setup

## Environment Variables

After deploying to Vercel, you need to configure the following environment variables in your Vercel project settings:

### Required Environment Variables

1. **NEXT_PROXY_FALLBACK** (optional, has fallback)
   - Value: `https://posters.aiml.cgify.com`
   - Description: Backend API URL for proxying requests
   - Note: Has a fallback value, but recommended to set explicitly

2. **NEXT_PUBLIC_API_BASE_URL** (optional, has fallback)
   - Value: `/api`
   - Description: Base URL for API requests (relative path)
   - Note: Has a fallback value of `/api`

### How to Set Environment Variables on Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable with its corresponding value
4. Select the environment(s) where it should be available:
   - Production
   - Preview
   - Development

### After Setting Variables

After adding environment variables:
1. Redeploy your application (or wait for automatic deployment)
2. The variables will be available in your application

## Troubleshooting CORS Issues

If you're still experiencing CORS issues after deployment:

1. **Check that rewrites are working**: Open browser DevTools → Network tab and verify that API requests go to `/api/*` paths, not directly to the backend

2. **Verify environment variables**: In Vercel dashboard, ensure `NEXT_PROXY_FALLBACK` is set correctly

3. **Check cookies**: The application uses cookies for authentication. Make sure your browser allows cookies from the Vercel domain

4. **Backend CORS configuration**: The backend API (`https://posters.aiml.cgify.com`) must allow requests from your Vercel domain

## API Request Flow

```
Frontend (Vercel) → /api/* → Next.js Middleware → https://posters.aiml.cgify.com/api/*
```

All API requests are proxied through Next.js middleware to avoid CORS issues.

## Files Configuration

- `middleware.ts` - Handles API proxying through Next.js middleware
- `next.config.mjs` - Basic Next.js configuration
- `.env.example` - Template for environment variables
- `.env.local` - Local development environment variables (not in git)

## How It Works

The middleware intercepts all requests to `/api/*` paths and rewrites them to the backend API URL (`https://posters.aiml.cgify.com/api/*`). This way:

1. Client-side fetch requests go to `/api/auth/session` (same origin)
2. Middleware rewrites to `https://posters.aiml.cgify.com/api/auth/session`
3. No CORS issues because the request is proxied server-side
4. Cookies work correctly with `credentials: 'include'`
