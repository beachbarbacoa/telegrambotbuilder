# Vercel Deployment Troubleshooting Guide

## Your Application URL
Your application is hosted at: https://telegrambotbuilder.vercel.app/

## Common Causes of Blank Page on Vercel

### 1. Client-Side Routing Issues
The most common cause of blank pages in React applications on Vercel is incorrect routing configuration.

**Solution**: Your vercel.json file looks correct with the rewrite rule:
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

This ensures that all routes are redirected to index.html for client-side routing to work.

### 2. Environment Variables Not Set
Your application requires environment variables to connect to Supabase.

**Solution**: Make sure these environment variables are set in your Vercel project settings:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

Note: VITE_STRIPE_PUBLIC_KEY is optional for basic testing. The application has been modified to work without Stripe for initial testing.

To set them:
1. Go to https://vercel.com/dashboard
2. Find your telegrambotbuilder project
3. Go to Settings > Environment Variables
4. Add each variable with the values from your local .env file

### 3. JavaScript Runtime Errors
If environment variables are missing or incorrect, the app might fail to initialize.

**Solution**: Check the browser console for errors:
1. Visit https://telegrambotbuilder.vercel.app/
2. Open Developer Tools (F12 or right-click and select "Inspect")
3. Go to the Console tab
4. Look for any error messages

### 4. Asset Loading Issues
Sometimes JavaScript or CSS assets fail to load.

**Solution**: Check the Network tab:
1. Open Developer Tools
2. Go to the Network tab
3. Refresh the page
4. Look for any 404 errors or failed requests

## How to Fix Your Deployment

### Step 1: Verify Environment Variables
1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Click on your telegrambotbuilder project
3. Click "Settings" then "Environment Variables"
4. Make sure these variables are set (Stripe is optional for testing):
   - VITE_SUPABASE_URL (should match your local .env)
   - VITE_SUPABASE_ANON_KEY (should match your local .env)
   - VITE_STRIPE_PUBLIC_KEY (optional for basic testing)

### Step 2: Trigger a New Deployment
After setting environment variables:
1. Go to the "Deployments" tab in your Vercel project
2. Click the "Redeploy" button for the latest deployment
3. Or push a small change to your GitHub repository to trigger a new deployment

### Step 3: Check Browser Console
After redeployment:
1. Visit https://telegrambotbuilder.vercel.app/
2. Open Developer Tools (F12)
3. Check Console tab for errors
4. Check Network tab for failed requests

## If Problems Persist

### Check Vercel Build Logs
1. Go to your Vercel dashboard
2. Click on your telegrambotbuilder project
3. Click on the latest deployment
4. Click "View Logs" to see the build process

### Verify Project Settings
1. In your Vercel project, go to Settings > General
2. Make sure these settings are correct:
   - Build & Development Settings:
     - Framework Preset: Vite
     - Build Command: npm run build
     - Output Directory: dist

## Quick Test
To verify Vercel is serving files correctly, you can create a simple test file:

1. Create a file called `test.html` in your `public` directory
2. Add some simple HTML content
3. Deploy to Vercel
4. Visit https://telegrambotbuilder.vercel.app/test.html

If this works, then Vercel is serving files correctly and the issue is with your React application.

## Need Help?
If you're still having issues after trying these steps:

1. Share any error messages from the browser console
2. Share any error messages from the Vercel build logs
3. Check that your Supabase project is properly configured and accessible