# Telegram Restaurant Bot SaaS Platform - Database Schema

## Overview
This document outlines the database schema for the Telegram Restaurant Bot SaaS Platform. The schema is designed to support multi-tenancy, subscription management, menu creation, order processing, and analytics.

## Core Tables

### 1. Restaurants
Stores information about restaurant accounts and their subscription status.

```sql
restaurants: {
  id: UUID (Primary Key)
  created_at: TIMESTAMP WITH TIME ZONE
  updated_at: TIMESTAMP WITH TIME ZONE
  name: TEXT
  email: TEXT (Unique)
  phone: TEXT
  address: TEXT
  city: TEXT
  country: TEXT
  postal_code: TEXT
  subscription_plan: TEXT (ENUM: 'monthly_50', 'monthly_125', 'monthly_unlimited', 'pay_per_order')
  payment_method: TEXT (ENUM: 'stripe', 'paypal', 'cash_pickup')
  status: TEXT (ENUM: 'active', 'inactive', 'suspended')
  stripe_customer_id: TEXT (Optional)
  telegram_bot_token: TEXT (Unique, for individual bots)
  telegram_bot_username: TEXT (Unique)
  menu_customization_limit: INTEGER (Default: 50)
  order_limit: INTEGER (Null for unlimited)
  orders_used: INTEGER (Default: 0)
  last_billing_date: DATE
  next_billing_date: DATE
}
```

### 2. Menus
Stores restaurant menu structures with categories and items.

```sql
menus: {
  id: UUID (Primary Key)
  created_at: TIMESTAMP WITH TIME ZONE
  updated_at: TIMESTAMP WITH TIME ZONE
  restaurant_id: UUID (Foreign Key to restaurants.id)
  name: TEXT
  description: TEXT
  is_active: BOOLEAN (Default: true)
  currency: TEXT (Default: 'USD')
}
```

### 3. Menu Categories
Stores menu categories for organizing items.

```sql
menu_categories: {
  id: UUID (Primary Key)
  created_at: TIMESTAMP WITH TIME ZONE
  updated_at: TIMESTAMP WITH TIME ZONE
  menu_id: UUID (Foreign Key to menus.id)
  name: TEXT
  description: TEXT
  position: INTEGER
  is_active: BOOLEAN (Default: true)
}
```

### 4. Menu Items
Stores individual menu items with pricing and customization options.

```sql
menu_items: {
  id: UUID (Primary Key)
  created_at: TIMESTAMP WITH TIME ZONE
  updated_at: TIMESTAMP WITH TIME ZONE
  category_id: UUID (Foreign Key to menu_categories.id)
  name: TEXT
  description: TEXT
  price: DECIMAL(10, 2)
  image_url: TEXT
  is_available: BOOLEAN (Default: true)
  prep_time: INTEGER (Minutes)
  position: INTEGER
  customization_options: JSONB (For add-ons, size options, etc.)
}
```

### 5. Orders
Stores customer orders placed through Telegram bots.

```sql
orders: {
  id: UUID (Primary Key)
  created_at: TIMESTAMP WITH TIME ZONE
  updated_at: TIMESTAMP WITH TIME ZONE
  restaurant_id: UUID (Foreign Key to restaurants.id)
  telegram_user_id: TEXT
  telegram_chat_id: TEXT
  customer_name: TEXT
  customer_phone: TEXT
  customer_address: TEXT
  order_items: JSONB (Array of items with quantities and customizations)
  subtotal: DECIMAL(10, 2)
  tax_amount: DECIMAL(10, 2)
  delivery_fee: DECIMAL(10, 2)
  total_amount: DECIMAL(10, 2)
  status: TEXT (ENUM: 'pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled')
  payment_status: TEXT (ENUM: 'pending', 'paid', 'failed', 'refunded')
  payment_intent_id: TEXT (For Stripe payments)
  special_instructions: TEXT
  estimated_pickup_time: TIMESTAMP WITH TIME ZONE
}
```

### 6. Subscriptions
Tracks subscription details and billing information.

```sql
subscriptions: {
  id: UUID (Primary Key)
  created_at: TIMESTAMP WITH TIME ZONE
  updated_at: TIMESTAMP WITH TIME ZONE
  restaurant_id: UUID (Foreign Key to restaurants.id)
  plan_type: TEXT (ENUM: 'monthly_50', 'monthly_125', 'monthly_unlimited', 'pay_per_order')
  status: TEXT (ENUM: 'active', 'cancelled', 'past_due', 'unpaid')
  start_date: DATE
  end_date: DATE
  current_period_start: DATE
  current_period_end: DATE
  stripe_subscription_id: TEXT
  billing_cycle: TEXT (ENUM: 'monthly', 'yearly')
  amount: DECIMAL(10, 2)
}
```

### 7. Payments
Records all payment transactions.

```sql
payments: {
  id: UUID (Primary Key)
  created_at: TIMESTAMP WITH TIME ZONE
  updated_at: TIMESTAMP WITH TIME ZONE
  order_id: UUID (Foreign Key to orders.id, Nullable for subscription payments)
  restaurant_id: UUID (Foreign Key to restaurants.id)
  amount: DECIMAL(10, 2)
  currency: TEXT (Default: 'USD')
  payment_method: TEXT (ENUM: 'stripe', 'paypal')
  transaction_id: TEXT
  status: TEXT (ENUM: 'pending', 'succeeded', 'failed', 'refunded')
  payment_intent_id: TEXT
  refunded_amount: DECIMAL(10, 2)
  fees_deducted: DECIMAL(10, 2)
}
```

### 8. Admin Users
Stores admin panel users for platform management.

```sql
admin_users: {
  id: UUID (Primary Key)
  created_at: TIMESTAMP WITH TIME ZONE
  updated_at: TIMESTAMP WITH TIME ZONE
  email: TEXT (Unique)
  password_hash: TEXT
  first_name: TEXT
  last_name: TEXT
  role: TEXT (ENUM: 'super_admin', 'admin', 'support')
  is_active: BOOLEAN (Default: true)
  last_login: TIMESTAMP WITH TIME ZONE
}
```

## Relationships

1. **Restaurants** ↔ **Menus** (One-to-Many)
2. **Menus** ↔ **Menu Categories** (One-to-Many)
3. **Menu Categories** ↔ **Menu Items** (One-to-Many)
4. **Restaurants** ↔ **Orders** (One-to-Many)
5. **Restaurants** ↔ **Subscriptions** (One-to-Many)
6. **Orders** ↔ **Payments** (One-to-One)
7. **Restaurants** ↔ **Payments** (One-to-Many)

## Indexes

1. `restaurants_email_idx` ON restaurants(email)
2. `restaurants_telegram_bot_username_idx` ON restaurants(telegram_bot_username)
3. `menus_restaurant_id_idx` ON menus(restaurant_id)
4. `menu_categories_menu_id_idx` ON menu_categories(menu_id)
5. `menu_items_category_id_idx` ON menu_items(category_id)
6. `orders_restaurant_id_idx` ON orders(restaurant_id)
7. `orders_telegram_user_id_idx` ON orders(telegram_user_id)
8. `orders_created_at_idx` ON orders(created_at)
9. `subscriptions_restaurant_id_idx` ON subscriptions(restaurant_id)
10. `payments_restaurant_id_idx` ON payments(restaurant_id)
11. `payments_order_id_idx` ON payments(order_id)

## Notes

1. All tables include `created_at` and `updated_at` timestamps for audit purposes.
2. Soft deletes are recommended using a `deleted_at` column where applicable.
3. JSONB fields are used for flexible data structures like customization options and order items.
4. Currency amounts are stored in cents/minor units to avoid floating-point precision issues.
5. Telegram-specific identifiers are stored as TEXT to accommodate their format.