import { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "./_utils/supabase";
import { Buffer } from 'buffer';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    try {
      const sig = req.headers['stripe-signature'];
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      
      if (!sig || !webhookSecret) {
        return res.status(400).json({ error: 'Missing signature or webhook secret' });
      }
      
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      
      // Get raw body
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk as Buffer);
      }
      const rawBody = Buffer.concat(chunks);
      
      let event;
      
      try {
        event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
      } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return res.status(400).json({ error: 'Webhook signature verification failed' });
      }
      
      // Handle the event
      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object;
          await handleCheckoutSessionCompleted(session);
          break;
        case 'invoice.payment_succeeded':
          const invoice = event.data.object;
          await handleInvoicePaymentSucceeded(invoice);
          break;
        case 'customer.subscription.deleted':
          const subscription = event.data.object;
          await handleSubscriptionCancelled(subscription);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
      
      res.status(200).json({ received: true });
    } catch (error) {
      console.error('Error handling webhook:', error);
      res.status(500).json({ error: 'Webhook handler failed' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Handle successful checkout session
const handleCheckoutSessionCompleted = async (session: any) => {
  try {
    const { restaurantId, planId } = session.metadata;
    
    if (!restaurantId || !planId) {
      console.error('Missing restaurantId or planId in session metadata');
      return;
    }
    
    // Update restaurant subscription
    const { error } = await supabase
      .from('restaurants')
      .update({
        subscription_plan: planId,
        stripe_customer_id: session.customer,
        status: 'active',
      })
      .eq('id', restaurantId);
      
    if (error) {
      console.error('Error updating restaurant subscription:', error);
    }
    
    // Create subscription record
    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert({
        restaurant_id: restaurantId,
        plan_type: planId,
        status: 'active',
        stripe_subscription_id: session.subscription,
        start_date: new Date().toISOString().split('T')[0],
        current_period_start: new Date().toISOString().split('T')[0],
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        amount: session.amount_total / 100, // Convert from cents
      });
      
    if (subscriptionError) {
      console.error('Error creating subscription record:', subscriptionError);
    }
  } catch (error) {
    console.error('Error handling checkout session completed:', error);
  }
};

// Handle successful invoice payment
const handleInvoicePaymentSucceeded = async (invoice: any) => {
  try {
    // Update subscription period
    const { error } = await supabase
      .from('subscriptions')
      .update({
        current_period_start: new Date(invoice.period_start * 1000).toISOString().split('T')[0],
        current_period_end: new Date(invoice.period_end * 1000).toISOString().split('T')[0],
        status: 'active',
      })
      .eq('stripe_subscription_id', invoice.subscription);
      
    if (error) {
      console.error('Error updating subscription period:', error);
    }
  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error);
  }
};

// Handle subscription cancellation
const handleSubscriptionCancelled = async (subscription: any) => {
  try {
    // Update restaurant status
    const { error } = await supabase
      .from('restaurants')
      .update({
        status: 'inactive',
      })
      .eq('stripe_customer_id', subscription.customer);
      
    if (error) {
      console.error('Error updating restaurant status:', error);
    }
    
    // Update subscription status
    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .update({
        status: 'cancelled',
        end_date: new Date().toISOString().split('T')[0],
      })
      .eq('stripe_subscription_id', subscription.id);
      
    if (subscriptionError) {
      console.error('Error updating subscription status:', subscriptionError);
    }
  } catch (error) {
    console.error('Error handling subscription cancelled:', error);
  }
};