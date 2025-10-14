# Deployment Guide

## Prerequisites

Before deploying the Telegram Restaurant Bot SaaS Platform, ensure you have:

1. A Supabase account and project
2. A Stripe account with API keys
3. A Vercel account for frontend deployment
4. A domain name (optional but recommended)

## Step 1: Set up Supabase

### 1.1 Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and API keys

### 1.2 Apply Database Migrations
1. In your Supabase project dashboard, go to the SQL editor
2. Copy and run the contents of `DATABASE_MIGRATION.sql` - this creates all the necessary tables in the correct order
3. After the tables are created, copy and run the contents of `DATABASE_FUNCTIONS.sql`

### 1.3 Configure Authentication
1. Go to Authentication > Settings in your Supabase dashboard
2. Enable Email signup
3. Configure email templates as needed

## Step 2: Set up Stripe

### 2.1 Create Stripe Account
1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete the verification process

### 2.2 Get API Keys
1. Go to Developers > API keys
2. Copy your publishable key and secret key
3. Set up webhooks:
   - Go to Developers > Webhooks
   - Add endpoint URL: `https://your-domain.com/api/stripe-webhook`
   - Select events: `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.deleted`
   - Copy the webhook signing secret

## Step 3: Configure Environment Variables

### 3.1 Frontend Environment Variables (Vercel)
Set these in your Vercel project settings:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key
VITE_APP_URL=https://your-domain.com
```

### 3.2 Backend Environment Variables (Vercel)
Set these in your Vercel project settings:

```env
SUPABASE_SERVICE_KEY=your_supabase_service_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

## Step 4: Deploy Frontend to Vercel

### 4.1 Connect Repository
1. Go to [vercel.com](https://vercel.com) and create a new project
2. Connect your GitHub repository
3. Select the root directory

### 4.2 Configure Project
1. Set the framework preset to "Vite"
2. Set the build command to `pnpm build`
3. Set the output directory to `dist`
4. Add the environment variables from Step 3.1

### 4.3 Deploy
1. Click "Deploy"
2. Wait for the deployment to complete
3. Note the deployment URL

## Step 5: Configure Telegram Bot Integration

### 5.1 Create BotFather Bot
1. Open Telegram and search for @BotFather
2. Start a chat and use the `/newbot` command
3. Follow the instructions to create your platform bot
4. Note the bot token

### 5.2 Set Webhook
1. Use the Telegram Bot API to set your webhook:
   ```
   https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=https://your-domain.com/api/telegram-webhook
   ```

## Step 6: Set up Admin Access

### 6.1 Create Admin User
1. In your Supabase dashboard, go to Table Editor
2. Create a new table called `admin_users`
3. Add an admin user with email `admin@restaurantbot.com` and a secure password

## Step 7: Testing

### 7.1 Test Restaurant Signup
1. Visit your deployed frontend
2. Go to the signup page
3. Create a test restaurant account
4. Verify email (if configured)

### 7.2 Test Payment Integration
1. Go to the billing page
2. Select a subscription plan
3. Complete a test payment using Stripe's test cards

### 7.3 Test Telegram Bot
1. Create a Telegram bot for your restaurant
2. Test the bot functionality

## Step 8: Production Checklist

- [ ] SSL certificate configured
- [ ] Domain DNS properly configured
- [ ] Email service configured for transactional emails
- [ ] Backup strategy implemented
- [ ] Monitoring and alerting configured
- [ ] Security audit completed
- [ ] Performance optimization applied
- [ ] Analytics and logging configured

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify Supabase URL and keys are correct
   - Check that authentication is enabled in Supabase

2. **Payment Processing Issues**
   - Verify Stripe keys are correct
   - Check that webhooks are properly configured
   - Ensure test mode is enabled for development

3. **Telegram Bot Not Responding**
   - Verify webhook URL is correct
   - Check that the bot token is valid
   - Ensure the webhook endpoint is accessible

### Support

For additional help, please:
1. Check the project documentation
2. Review the code comments
3. Open an issue on GitHub
4. Contact the development team

## Maintenance

### Regular Tasks
- Monitor payment processing
- Review subscription renewals
- Check bot performance
- Update dependencies
- Review security logs

### Updates
When deploying updates:
1. Test in a staging environment first
2. Backup the database
3. Deploy frontend changes
4. Deploy backend changes
5. Monitor for issues