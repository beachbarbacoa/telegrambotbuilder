// API route for creating Stripe checkout sessions
import { supabase } from "@/integrations/supabase/client";

const createCheckoutSession = async (req: Request) => {
  try {
    const { restaurantId, planId } = await req.json();
    
    // Validate restaurant exists
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .select('id, name, email')
      .eq('id', restaurantId)
      .single();
      
    if (restaurantError || !restaurant) {
      return new Response(
        JSON.stringify({ error: 'Restaurant not found' }),
        { status: 404 }
      );
    }
    
    // Plan prices (in cents)
    const planPrices: Record<string, number> = {
      'monthly_50': 4900,
      'monthly_125': 9900,
      'monthly_unlimited': 19900,
    };
    
    const planNames: Record<string, string> = {
      'monthly_50': '50 Orders Plan',
      'monthly_125': '125 Orders Plan',
      'monthly_unlimited': 'Unlimited Plan',
    };
    
    // Validate plan
    if (!planPrices[planId]) {
      return new Response(
        JSON.stringify({ error: 'Invalid plan selected' }),
        { status: 400 }
      );
    }
    
    // Create Stripe checkout session
    const stripe = require('stripe')(import.meta.env.VITE_STRIPE_SECRET_KEY);
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: restaurant.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${planNames[planId]} - ${restaurant.name}`,
              description: `Telegram Bot Service for ${restaurant.name}`,
            },
            recurring: {
              interval: 'month',
            },
            unit_amount: planPrices[planId],
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${import.meta.env.VITE_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${import.meta.env.VITE_APP_URL}/dashboard/billing`,
      client_reference_id: restaurantId,
      metadata: {
        restaurantId,
        planId,
      },
    });
    
    return new Response(
      JSON.stringify({ sessionId: session.id }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create checkout session' }),
      { status: 500 }
    );
  }
};

// Webhook handler for Stripe events
const handleStripeWebhook = async (req: Request) => {
  try {
    const sig = req.headers.get('stripe-signature');
    const webhookSecret = import.meta.env.VITE_STRIPE_WEBHOOK_SECRET;
    
    if (!sig || !webhookSecret) {
      return new Response(
        JSON.stringify({ error: 'Missing signature or webhook secret' }),
        { status: 400 }
      );
    }
    
    const stripe = require('stripe')(import.meta.env.VITE_STRIPE_SECRET_KEY);
    const body = await req.text();
    
    let event;
    
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new Response(
        JSON.stringify({ error: 'Webhook signature verification failed' }),
        { status: 400 }
      );
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
    
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return new Response(
      JSON.stringify({ error: 'Webhook handler failed' }),
      { status: 500 }
    );
  }
};

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

export { createCheckoutSession, handleStripeWebhook };