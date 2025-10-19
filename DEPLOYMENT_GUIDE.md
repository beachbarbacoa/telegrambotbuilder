# Deployment Guide

## Prerequisites
- Node.js installed
- Vercel account
- Supabase account with project created
- Stripe account (optional for initial testing)

## Deployment Steps

### 1. Build the Application
```bash
npm run build
```

### 2. Test Locally (Optional)
```bash
npm run preview
```

### 3. Deploy to Vercel

#### Option A: Using Vercel CLI
1. Install Vercel CLI (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy the project:
   ```bash
   vercel --prod --yes
   ```

#### Option B: Using GitHub Integration
1. Push your code to a GitHub repository
2. Go to your Vercel dashboard
3. Click "New Project"
4. Import your GitHub repository
5. Configure the project settings:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### 4. Configure Environment Variables
In your Vercel project settings, add the following environment variables:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Note: VITE_STRIPE_PUBLIC_KEY is optional for basic testing. The application has been modified to work without Stripe for initial testing.

### 5. Redeploy
After adding environment variables, redeploy the application:
```bash
vercel --prod
```

## Troubleshooting Deployment Issues

### Blank Page After Deployment

If you see a blank page after deployment, follow these steps:

1. **Check Browser Console**:
   - Open Developer Tools (F12)
   - Look for JavaScript errors in the Console tab
   - Check the Network tab for 404 errors on assets

2. **Verify Vercel Configuration**:
   - Check that Build Command is set to `npm run build`
   - Check that Output Directory is set to `dist`
   - Verify all environment variables are set

3. **Test with a Simple HTML File**:
   - Create a simple HTML file in the public directory
   - Deploy and verify it loads correctly
   - This confirms Vercel is serving files properly

### Vercel CLI Authentication Issues

If you're having trouble with `vercel login`:

1. Try logging out and back in:
   ```bash
   vercel logout
   vercel login
   ```

2. If that doesn't work, create a token manually:
   - Go to Vercel Dashboard > Settings > Tokens
   - Create a new token
   - Use it with:
     ```bash
     vercel login --token=your_token_here
     ```

### Build Failures

If the build fails on Vercel:

1. Check the build logs in Vercel dashboard
2. Ensure all dependencies are in package.json
3. Verify TypeScript compilation works locally with `npm run build`

## Post-Deployment Verification

1. Visit the main page and verify it loads correctly
2. Test navigation to signup and login pages
3. Try creating a new account
4. Test logging in with the new account
5. Verify that the dashboard loads after login

## Adding Stripe Later

To enable full payment functionality:

1. Create a Stripe account
2. Add these environment variables to Vercel:
   ```bash
   VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```
3. Redeploy the application

## Additional Notes

- The application uses React Router for client-side routing
- The vercel.json file is configured for SPA routing
- All API routes are handled by the Vercel serverless functions in the /api directory

## Common Vercel Issues and Solutions

### 404 Errors on Routes

If you get 404 errors when navigating to routes:

1. Check that vercel.json has the correct rewrite configuration:
   ```json
   {
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/"
       }
     ]
   }
   ```

2. Ensure the rewrite rule is in place for SPA routing

### Environment Variables Not Loading

If environment variables are not loading:

1. Verify they are set in Vercel project settings
2. Ensure they are prefixed with `VITE_` for client-side access
3. Redeploy after adding environment variables

### Large Bundle Size Warnings

The application may show warnings about large bundle sizes. This is normal for feature-rich applications. To reduce bundle size:

1. Use dynamic imports for code splitting
2. Lazy load components that aren't immediately needed
3. Optimize images and assets