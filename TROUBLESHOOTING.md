# Troubleshooting Guide

## Signup Issue: "Account created but profile setup failed"

This error occurs when the user authentication account is created successfully in Supabase, but there's an issue with creating the restaurant profile in the database.

### Common Causes and Solutions

#### 1. Database Tables Not Created
**Symptoms**: Profile setup fails with database-related errors
**Solution**: 
1. Go to your Supabase project dashboard
2. Navigate to the SQL editor
3. Run the database migration script from `DATABASE_MIGRATION.sql` or the setup script from `scripts/setup-database.sql`

#### 2. Missing or Incorrect Environment Variables
**Symptoms**: Connection errors or authentication failures
**Solution**:
1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Verify these variables are set correctly:
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
   - `SUPABASE_SERVICE_KEY` - Your Supabase service key
4. Redeploy your application after making changes

#### 3. Database Permissions Issues
**Symptoms**: Access denied or permission errors
**Solution**:
1. In Supabase, go to Authentication > Policies
2. Ensure the restaurants table has appropriate RLS (Row Level Security) policies
3. Check that your Supabase service key has the necessary permissions

#### 4. Table Structure Mismatch
**Symptoms**: Column not found or data type errors
**Solution**:
1. Run the verification script from `scripts/verify-database.js` in your Supabase SQL editor
2. Compare the output with the expected schema in `DATABASE_SCHEMA.md`
3. Update your database schema if needed

### Diagnostic Steps

#### Step 1: Test Database Connection
1. Visit your deployed site
2. Click on "Connection Test (Debug)" on the main page
3. Check the results for connection and table status

#### Step 2: Check Browser Console
1. Open your browser's developer tools (F12)
2. Go to the Console tab
3. Try to signup again
4. Look for any error messages

#### Step 3: Check Supabase Logs
1. In your Supabase dashboard, go to Logs
2. Look for any errors related to database operations
3. Check both authentication and database logs

#### Step 4: Manual Database Verification
1. In Supabase SQL editor, run:
   ```sql
   SELECT * FROM restaurants LIMIT 5;
   ```
2. If this fails, the restaurants table may not exist or have permission issues

### Quick Fix Script

If you're still having issues, try running this in your Supabase SQL editor:

```sql
-- Check if restaurants table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'restaurants'
);

-- If it doesn't exist, run the setup script from scripts/setup-database.sql
```

### Need More Help?

If you're still experiencing issues:

1. Check the browser console for detailed error messages
2. Verify all environment variables are correctly set in Vercel
3. Ensure the database migration has been run in Supabase
4. Contact support with the specific error message you're seeing

### Common Error Messages and Solutions

#### "relation 'restaurants' does not exist"
**Solution**: Run the database migration script

#### "duplicate key value violates unique constraint"
**Solution**: This might happen if trying to insert a duplicate email. The system should handle this gracefully, but you can manually delete test records if needed:
```sql
DELETE FROM restaurants WHERE email = 'test@example.com';
```

#### "null value in column 'id' violates not-null constraint"
**Solution**: This shouldn't happen with the current code, but ensure you're using a recent version of the signup component.

#### "permission denied for table restaurants"
**Solution**: Check your Supabase RLS policies and service key permissions.