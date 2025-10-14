# Telegram Restaurant Bot SaaS Platform

A fully automated SaaS platform that allows restaurants to create their own Telegram ordering bots through a self-service web portal.

## Features

### Restaurant Web Portal
- **User Registration & Authentication**
  - Restaurant signup/login with email verification
  - Password reset functionality
- **Subscription Management**
  - Plan selection (Monthly vs Pay-per-order)
  - Stripe integration for payments
  - Subscription status tracking
- **Menu Management System**
  - Drag-and-drop menu builder
  - Category management
  - Item creation with pricing and images
- **Dashboard & Analytics**
  - Order history and statistics
  - Revenue reports
  - Performance metrics

### Telegram Bot Factory
- **Automated Bot Creation**
  - Dynamic bot generation via Telegram BotFather API
  - Custom bot usernames for each restaurant
- **Bot Features**
  - Interactive menu browsing with inline keyboards
  - Shopping cart management
  - Order customization options
  - Order confirmation and status updates

### Payment System
- **Option A (Our Payments)**
  - Telegram native payments integration
  - Stripe Connect for split payments
  - Automatic fee deduction
- **Option B (Their Payments)**
  - Payment instruction delivery
  - Cash/credit handling at pickup

### Admin Control Panel
- **Platform Management**
  - Restaurant account management
  - Revenue and analytics dashboard
  - System monitoring
- **Bot Control**
  - Suspend/activate bots based on payment status
  - Bulk operations

## Tech Stack

- **Frontend**: React/TypeScript with Vite
- **Backend**: Supabase (Database, Authentication, Functions)
- **Payments**: Stripe API
- **Telegram**: Telegraf library
- **Hosting**: Vercel (frontend), Supabase (backend)
- **Database**: PostgreSQL (via Supabase)

## Project Structure

```
.
├── src/
│   ├── components/          # Reusable UI components
│   ├── context/             # React context providers
│   ├── hooks/               # Custom React hooks
│   ├── integrations/        # Third-party service integrations
│   ├── lib/                 # Utility functions
│   ├── pages/               # Page components
│   │   ├── admin/           # Admin panel pages
│   │   ├── auth/            # Authentication pages
│   │   └── dashboard/       # Restaurant dashboard pages
│   ├── services/            # Business logic services
│   └── utils/               # Helper functions
├── api/                     # Vercel serverless functions
└── public/                  # Static assets
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm (package manager)
- Supabase account
- Stripe account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd telegram-restaurant-bot
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
VITE_APP_URL=https://your-app-url.com
```

4. Run database migrations:
Apply the SQL scripts in `DATABASE_MIGRATION.sql` and `DATABASE_FUNCTIONS.sql` to your Supabase database.

5. Start the development server:
```bash
pnpm dev
```

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set the environment variables in Vercel project settings
3. Deploy!

### Backend (Supabase)
1. Deploy the database schema and functions to Supabase
2. Configure authentication settings
3. Set up Stripe webhooks

## Environment Variables

Refer to `ENVIRONMENT_VARIABLES.md` for a complete list of required environment variables.

## Database Schema

Refer to `DATABASE_SCHEMA.md` for the complete database schema documentation.

## API Endpoints

### Frontend API Routes
- `/api/stripe-checkout` - Create Stripe checkout sessions
- `/api/stripe-webhook` - Handle Stripe webhook events

## Testing

Run the test suite:
```bash
pnpm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue on the GitHub repository or contact the maintainers.