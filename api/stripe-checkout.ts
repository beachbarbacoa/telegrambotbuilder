import { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "./_utils/supabase.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    // Handle CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    try {
      const { restaurantId, planId } = req.body;
      
      // Validate restaurant exists
      const { data: restaurant, error: restaurantError } = await supabase
        .from('restaurants')
        .select('id, name, email')
        .eq('id', restaurantId)
        .single();
        
      if (restaurantError || !restaurant) {
        return res.status(404).json({ error: 'Restaurant not found' });
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
        return res.status(400).json({ error: 'Invalid plan selected' });
      }
      
      // Create Stripe checkout session
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      
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
        success_url: `${process.env.APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.APP_URL}/dashboard/billing`,
        client_reference_id: restaurantId,
        metadata: {
          restaurantId,
          planId,
        },
      });
      
      res.status(200).json({ sessionId: session.id });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: 'Failed to create checkout session' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}