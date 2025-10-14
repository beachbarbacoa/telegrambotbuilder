# Environment Variables

## Required Environment Variables

### Supabase
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_KEY` - Your Supabase service key (for server-side operations)

### Stripe
- `VITE_STRIPE_PUBLIC_KEY` - Your Stripe publishable key
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook signing secret

### Application
- `VITE_APP_URL` - Your application URL (e.g., https://your-app.vercel.app)

## Example .env file

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
VITE_APP_URL=https://your-app.vercel.app
```

## Vercel Environment Variables

When deploying to Vercel, you'll need to set the following environment variables in your project settings:

1. `VITE_SUPABASE_URL`
2. `VITE_SUPABASE_ANON_KEY`
3. `SUPABASE_SERVICE_KEY`
4. `STRIPE_SECRET_KEY`
5. `STRIPE_WEBHOOK_SECRET`
6. `VITE_APP_URL`

Note: Variables prefixed with `VITE_` are exposed to the client-side, while others are server-side only.