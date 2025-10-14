-- Database Functions for Telegram Restaurant Bot SaaS Platform

-- Function to increment orders used for a restaurant
CREATE OR REPLACE FUNCTION increment_orders_used(restaurant_id UUID)
RETURNS INTEGER AS $$
DECLARE
  current_orders INTEGER;
  order_limit INTEGER;
BEGIN
  -- Get current orders used and order limit
  SELECT orders_used, order_limit 
  INTO current_orders, order_limit
  FROM restaurants 
  WHERE id = restaurant_id;
  
  -- Check if restaurant has exceeded order limit
  IF order_limit IS NOT NULL AND current_orders >= order_limit THEN
    RAISE EXCEPTION 'Order limit exceeded for restaurant %', restaurant_id;
  END IF;
  
  -- Increment orders used
  UPDATE restaurants 
  SET orders_used = orders_used + 1 
  WHERE id = restaurant_id;
  
  -- Return new orders used count
  RETURN current_orders + 1;
END;
$$ LANGUAGE plpgsql;

-- Function to reset monthly order counts
CREATE OR REPLACE FUNCTION reset_monthly_orders()
RETURNS VOID AS $$
BEGIN
  UPDATE restaurants 
  SET orders_used = 0 
  WHERE subscription_plan != 'monthly_unlimited';
END;
$$ LANGUAGE plpgsql;

-- Function to calculate platform revenue
CREATE OR REPLACE FUNCTION calculate_platform_revenue(start_date DATE, end_date DATE)
RETURNS NUMERIC AS $$
DECLARE
  total_revenue NUMERIC;
BEGIN
  SELECT SUM(amount - fees_deducted)
  INTO total_revenue
  FROM payments
  WHERE created_at::date BETWEEN start_date AND end_date
  AND status = 'succeeded';
  
  RETURN COALESCE(total_revenue, 0);
END;
$$ LANGUAGE plpgsql;

-- Function to get active restaurants count
CREATE OR REPLACE FUNCTION get_active_restaurants_count()
RETURNS INTEGER AS $$
DECLARE
  count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO count
  FROM restaurants
  WHERE status = 'active';
  
  RETURN count;
END;
$$ LANGUAGE plpgsql;

-- Function to get total orders in period
CREATE OR REPLACE FUNCTION get_orders_count(start_date DATE, end_date DATE)
RETURNS INTEGER AS $$
DECLARE
  count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO count
  FROM orders
  WHERE created_at::date BETWEEN start_date AND end_date;
  
  RETURN count;
END;
$$ LANGUAGE plpgsql;