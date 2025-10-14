-- Database Migration Script for Telegram Restaurant Bot SaaS Platform

-- Create restaurants table first
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  postal_code TEXT,
  subscription_plan TEXT,
  payment_method TEXT,
  status TEXT DEFAULT 'active',
  stripe_customer_id TEXT,
  telegram_bot_token TEXT UNIQUE,
  telegram_bot_username TEXT UNIQUE,
  menu_customization_limit INTEGER DEFAULT 50,
  order_limit INTEGER,
  orders_used INTEGER DEFAULT 0,
  last_billing_date DATE,
  next_billing_date DATE
);

-- Create menus table
CREATE TABLE IF NOT EXISTS menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  currency TEXT DEFAULT 'USD'
);

-- Create menu_categories table
CREATE TABLE IF NOT EXISTS menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  menu_id UUID REFERENCES menus(id) ON DELETE CASCADE,
  name TEXT,
  description TEXT,
  position INTEGER,
  is_active BOOLEAN DEFAULT true
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  category_id UUID REFERENCES menu_categories(id) ON DELETE CASCADE,
  name TEXT,
  description TEXT,
  price DECIMAL(10, 2),
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  prep_time INTEGER,
  position INTEGER,
  customization_options JSONB
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  telegram_user_id TEXT,
  telegram_chat_id TEXT,
  customer_name TEXT,
  customer_phone TEXT,
  customer_address TEXT,
  order_items JSONB,
  subtotal DECIMAL(10, 2),
  tax_amount DECIMAL(10, 2),
  delivery_fee DECIMAL(10, 2),
  total_amount DECIMAL(10, 2),
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  payment_intent_id TEXT,
  special_instructions TEXT,
  estimated_pickup_time TIMESTAMP WITH TIME ZONE
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  plan_type TEXT,
  status TEXT DEFAULT 'active',
  start_date DATE,
  end_date DATE,
  current_period_start DATE,
  current_period_end DATE,
  stripe_subscription_id TEXT,
  billing_cycle TEXT,
  amount DECIMAL(10, 2)
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2),
  currency TEXT DEFAULT 'USD',
  payment_method TEXT,
  transaction_id TEXT,
  status TEXT DEFAULT 'pending',
  payment_intent_id TEXT,
  refunded_amount DECIMAL(10, 2) DEFAULT 0,
  fees_deducted DECIMAL(10, 2) DEFAULT 0
);

-- Create telegram_bots table
CREATE TABLE IF NOT EXISTS telegram_bots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  webhook_url TEXT,
  UNIQUE(restaurant_id)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS restaurants_email_idx ON restaurants(email);
CREATE INDEX IF NOT EXISTS menus_restaurant_id_idx ON menus(restaurant_id);
CREATE INDEX IF NOT EXISTS menu_categories_menu_id_idx ON menu_categories(menu_id);
CREATE INDEX IF NOT EXISTS menu_items_category_id_idx ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS orders_restaurant_id_idx ON orders(restaurant_id);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at);
CREATE INDEX IF NOT EXISTS subscriptions_restaurant_id_idx ON subscriptions(restaurant_id);
CREATE INDEX IF NOT EXISTS payments_restaurant_id_idx ON payments(restaurant_id);
CREATE INDEX IF NOT EXISTS payments_order_id_idx ON payments(order_id);
CREATE INDEX IF NOT EXISTS telegram_bots_restaurant_id_idx ON telegram_bots(restaurant_id);
CREATE INDEX IF NOT EXISTS telegram_bots_username_idx ON telegram_bots(username);
CREATE INDEX IF NOT EXISTS telegram_bots_token_idx ON telegram_bots(token);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE telegram_bots ENABLE ROW LEVEL SECURITY;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
DROP TRIGGER IF EXISTS update_restaurants_updated_at ON restaurants;
CREATE TRIGGER update_restaurants_updated_at
    BEFORE UPDATE ON restaurants
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_menus_updated_at ON menus;
CREATE TRIGGER update_menus_updated_at
    BEFORE UPDATE ON menus
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_menu_categories_updated_at ON menu_categories;
CREATE TRIGGER update_menu_categories_updated_at
    BEFORE UPDATE ON menu_categories
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_menu_items_updated_at ON menu_items;
CREATE TRIGGER update_menu_items_updated_at
    BEFORE UPDATE ON menu_items
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_telegram_bots_updated_at ON telegram_bots;
CREATE TRIGGER update_telegram_bots_updated_at
    BEFORE UPDATE ON telegram_bots
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();