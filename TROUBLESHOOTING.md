# Troubleshooting Guide

## Blank Page Issue Resolution

### Problem
The application was loading blank pages for all routes including the main page, signup, and login pages.

### Root Causes Identified
1. Reference to non-existent route in Login component (`/auth/forgot-password`)
2. Incomplete App component with missing routes
3. Potential Vercel deployment configuration issues

### Fixes Applied

#### 1. Fixed Login Component
Removed the "Forgot password?" link that was referencing a non-existent route:
```typescript
// Removed this line:
// <Button variant="link" onClick={() => navigate("/auth/forgot-password")}>
//   Forgot password?
// </Button>
```

#### 2. Restored Complete App Component
Replaced the minimal App component with the full version that includes all necessary routes:
- Main routes (/, /test, /auth/signup, /auth/login, /auth/test)
- Admin routes (/admin/* with sub-routes)
- Dashboard routes (/dashboard/* with protected sub-routes)
- Proper error handling with NotFound component

#### 3. Verified Build Process
Confirmed that `npm run build` completes successfully and generates the dist folder with all necessary assets.

#### 4. Tested Local Preview
Verified that `npm run preview` serves the application correctly at http://localhost:4173/

### Current Issue: Vercel Deployment

The application builds correctly locally but may still have deployment issues on Vercel. Here are steps to troubleshoot:

#### 1. Check Vercel Project Settings
- Ensure the build command is set to `npm run build`
- Ensure the output directory is set to `dist`
- Verify all environment variables are set in Vercel project settings

#### 2. Manual Deployment Through Vercel Dashboard
If CLI deployment is not working:
1. Push your code to GitHub
2. Connect your GitHub repository to Vercel through the dashboard
3. Let Vercel automatically deploy on push

#### 3. Check Browser Console
When visiting the deployed site:
1. Open browser developer tools (F12)
2. Check the Console tab for JavaScript errors
3. Check the Network tab to see if assets are loading correctly

#### 4. Verify Environment Variables
Ensure these environment variables are set in Vercel:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_STRIPE_PUBLIC_KEY

### Deployment Instructions

1. **Login to Vercel** (if not already logged in):
   ```bash
   npx vercel login
   ```
   Follow the prompts to authenticate with your Vercel account.

2. **Deploy to Vercel**:
   ```bash
   npx vercel --prod --yes
   ```

3. **Alternative Deployment Method**:
   If you have the Vercel project already set up, you can also deploy by:
   - Pushing your changes to GitHub
   - Connecting your GitHub repository to Vercel
   - Letting Vercel automatically deploy on push

### Additional Notes

- The vercel.json file is correctly configured for SPA routing with rewrites
- All environment variables should be set in the Vercel project settings
- The build process should complete without errors

## Common Issues and Solutions

### 1. Build Errors
If you encounter build errors:
- Check that all dependencies are installed: `npm install`
- Verify TypeScript compilation: `npm run build`
- Check for any syntax errors in the code

### 2. Routing Issues
If routes are not working correctly:
- Ensure all routes are properly defined in App.tsx
- Check that the vercel.json file has the correct rewrite rules
- Verify that all components referenced in routes exist

### 3. Environment Variables
If the application is not connecting to Supabase:
- Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in Vercel environment variables
- Check that the Supabase project is properly configured

## Testing
After deployment:
1. Visit the main page and verify it loads correctly
2. Try navigating to /auth/signup and /auth/login
3. Test the signup process with a new account
4. Test the login process with an existing account

## Vercel CLI Authentication Issues

If you're experiencing authentication issues with Vercel CLI:

1. Try clearing Vercel credentials:
   ```bash
   npx vercel logout
   ```

2. Then login again:
   ```bash
   npx vercel login
   ```

3. If that doesn't work, manually create a token:
   - Go to Vercel dashboard
   - Go to Settings > Tokens
   - Create a new token
   - Use it with:
     ```bash
     npx vercel login --token=your_token_here
     ```

## Browser Debugging Steps

If the deployed site shows a blank page:

1. Open browser developer tools (F12)
2. Check the Console tab for errors
3. Check the Network tab to see if:
   - index.html loads correctly
   - JavaScript files load without 404 errors
   - CSS files load correctly
4. Check the Sources tab to see if JavaScript is executing

Common issues:
- 404 errors on JavaScript/CSS files (routing configuration issue)
- JavaScript errors preventing app initialization
- Missing environment variables causing runtime errors