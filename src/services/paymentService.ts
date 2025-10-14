// Payment Service
import { supabase } from "@/integrations/supabase/client";

interface Payment {
  id: string;
  order_id: string | null;
  restaurant_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  transaction_id: string;
  status: string;
  payment_intent_id: string;
  refunded_amount: number;
  fees_deducted: number;
}

interface Order {
  id: string;
  restaurant_id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  order_items: any[];
  subtotal: number;
  tax_amount: number;
  delivery_fee: number;
  total_amount: number;
  status: string;
  payment_status: string;
  payment_intent_id: string;
  special_instructions: string;
  estimated_pickup_time: string;
}

export class PaymentService {
  // Process a subscription payment
  static async processSubscriptionPayment(
    restaurantId: string,
    planType: string,
    amount: number
  ): Promise<{ success: boolean; payment?: Payment; error?: string }> {
    try {
      // In a real implementation, this would:
      // 1. Create a Stripe payment intent
      // 2. Process the payment
      // 3. Update the restaurant's subscription status
      // 4. Record the payment in the database
      
      // For simulation, we'll just create a payment record
      const { data, error } = await supabase
        .from('payments')
        .insert({
          restaurant_id: restaurantId,
          amount: amount,
          currency: 'usd',
          payment_method: 'stripe',
          transaction_id: `txn_${Date.now()}`,
          status: 'succeeded',
          payment_intent_id: `pi_${Date.now()}`,
          refunded_amount: 0,
          fees_deducted: amount * 0.029 + 0.30, // 2.9% + $0.30 Stripe fees
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: 'Failed to process subscription payment' };
      }

      // Update restaurant subscription
      const { error: updateError } = await supabase
        .from('restaurants')
        .update({
          subscription_plan: planType,
          last_billing_date: new Date().toISOString().split('T')[0],
          next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        })
        .eq('id', restaurantId);

      if (updateError) {
        return { success: false, error: 'Failed to update subscription' };
      }

      return { success: true, payment: data };
    } catch (error) {
      console.error('Error processing subscription payment:', error);
      return { success: false, error: 'Failed to process subscription payment' };
    }
  }

  // Process a pay-per-order payment
  static async processPayPerOrderPayment(
    restaurantId: string,
    orderId: string,
    amount: number
  ): Promise<{ success: boolean; payment?: Payment; error?: string }> {
    try {
      // In a real implementation, this would:
      // 1. Create a Stripe payment intent
      // 2. Process the payment
      // 3. Update the order status
      // 4. Record the payment in the database
      // 5. Increment the restaurant's order count
      
      // For simulation, we'll just create a payment record
      const { data, error } = await supabase
        .from('payments')
        .insert({
          order_id: orderId,
          restaurant_id: restaurantId,
          amount: amount,
          currency: 'usd',
          payment_method: 'stripe',
          transaction_id: `txn_${Date.now()}`,
          status: 'succeeded',
          payment_intent_id: `pi_${Date.now()}`,
          refunded_amount: 0,
          fees_deducted: amount * 0.029 + 0.30, // 2.9% + $0.30 Stripe fees
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: 'Failed to process pay-per-order payment' };
      }

      // Update order payment status
      const { error: orderError } = await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          payment_intent_id: data.payment_intent_id,
        })
        .eq('id', orderId);

      if (orderError) {
        return { success: false, error: 'Failed to update order payment status' };
      }

      // Increment restaurant's order count
      const { error: restaurantError } = await supabase
        .from('restaurants')
        .update({
          orders_used: supabase.rpc('increment_orders_used', { restaurant_id: restaurantId }),
        })
        .eq('id', restaurantId);

      if (restaurantError) {
        return { success: false, error: 'Failed to update restaurant order count' };
      }

      return { success: true, payment: data };
    } catch (error) {
      console.error('Error processing pay-per-order payment:', error);
      return { success: false, error: 'Failed to process pay-per-order payment' };
    }
  }

  // Refund a payment
  static async refundPayment(
    paymentId: string,
    amount?: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Get the payment details
      const { data: payment, error: fetchError } = await supabase
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .single();

      if (fetchError || !payment) {
        return { success: false, error: 'Payment not found' };
      }

      // In a real implementation, this would:
      // 1. Call Stripe's refund API
      // 2. Process the refund
      // 3. Update the payment record
      
      // For simulation, we'll just update the payment record
      const refundAmount = amount || payment.amount;
      
      const { error } = await supabase
        .from('payments')
        .update({
          status: 'refunded',
          refunded_amount: payment.refunded_amount + refundAmount,
        })
        .eq('id', paymentId);

      if (error) {
        return { success: false, error: 'Failed to process refund' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error processing refund:', error);
      return { success: false, error: 'Failed to process refund' };
    }
  }

  // Get payment history for a restaurant
  static async getPaymentHistory(
    restaurantId: string
  ): Promise<{ success: boolean; payments?: Payment[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: 'Failed to fetch payment history' };
      }

      return { success: true, payments: data };
    } catch (error) {
      console.error('Error fetching payment history:', error);
      return { success: false, error: 'Failed to fetch payment history' };
    }
  }

  // Get order details with payment information
  static async getOrderWithPayment(
    orderId: string
  ): Promise<{ success: boolean; order?: Order & { payment?: Payment }; error?: string }> {
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError || !order) {
        return { success: false, error: 'Order not found' };
      }

      // Get payment information if available
      let payment = null;
      if (order.payment_intent_id) {
        const { data: paymentData, error: paymentError } = await supabase
          .from('payments')
          .select('*')
          .eq('payment_intent_id', order.payment_intent_id)
          .single();

        if (!paymentError && paymentData) {
          payment = paymentData;
        }
      }

      return { success: true, order: { ...order, payment } };
    } catch (error) {
      console.error('Error fetching order with payment:', error);
      return { success: false, error: 'Failed to fetch order with payment' };
    }
  }
}