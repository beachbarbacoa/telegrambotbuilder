"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { showError, showSuccess } from "@/utils/toast";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "");

const Billing = () => {
  const { restaurant } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Plan options
  const planOptions = [
    {
      id: "monthly_50",
      name: "50 Orders Plan",
      price: "$49",
      description: "Perfect for small restaurants. 50 orders per month.",
      orderLimit: 50,
    },
    {
      id: "monthly_125",
      name: "125 Orders Plan",
      price: "$99",
      description: "Great for growing restaurants. 125 orders per month.",
      orderLimit: 125,
    },
    {
      id: "monthly_unlimited",
      name: "Unlimited Plan",
      price: "$199",
      description: "Best for busy restaurants. Unlimited orders per month.",
      orderLimit: null,
    },
    {
      id: "pay_per_order",
      name: "Pay Per Order",
      price: "$2.00",
      description: "No monthly fee. Pay only for orders processed.",
      orderLimit: null,
    },
  ];

  useEffect(() => {
    if (restaurant) {
      setSelectedPlan(restaurant.subscription_plan || "");
    }
  }, [restaurant]);

  const handlePlanChange = async () => {
    if (!selectedPlan || !restaurant) return;
    
    setLoading(true);
    
    try {
      // If switching to a paid plan, redirect to Stripe checkout
      if (selectedPlan !== "pay_per_order" && selectedPlan.startsWith("monthly_")) {
        await redirectToCheckout(selectedPlan);
      } else {
        // For pay-per-order, update directly
        const { error } = await supabase
          .from('restaurants')
          .update({
            subscription_plan: selectedPlan,
            order_limit: planOptions.find(p => p.id === selectedPlan)?.orderLimit,
          })
          .eq('id', restaurant.id);

        if (error) {
          showError("Failed to update subscription. Please try again.");
          return;
        }

        showSuccess("Subscription updated successfully!");
      }
    } catch (error) {
      showError("Failed to update subscription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const redirectToCheckout = async (planId: string) => {
    try {
      setIsProcessing(true);
      
      // Create Stripe checkout session
      const response = await fetch("/api/stripe-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurantId: restaurant?.id,
          planId,
        }),
      });

      const { sessionId } = await response.json();
      
      // Redirect to Stripe checkout
      const stripe = await stripePromise;
      if (stripe && sessionId) {
        // Redirect using window.location
        window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;
      }
    } catch (error) {
      showError("Failed to initiate checkout. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Billing & Subscription</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Current Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          {restaurant ? (
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">
                  {planOptions.find(p => p.id === restaurant.subscription_plan)?.name || "Unknown Plan"}
                </h3>
                <p className="text-gray-500">
                  {restaurant.subscription_plan === "pay_per_order" 
                    ? `$2.00 per order` 
                    : `${planOptions.find(p => p.id === restaurant.subscription_plan)?.price}/month`}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium capitalize">{restaurant.status}</p>
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Subscription Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={selectedPlan} 
            onValueChange={setSelectedPlan}
            className="space-y-4"
          >
            {planOptions.map((plan) => (
              <div 
                key={plan.id} 
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value={plan.id} id={plan.id} />
                  <Label htmlFor={plan.id} className="cursor-pointer">
                    <div className="font-medium">{plan.name}</div>
                    <div className="text-sm text-gray-500">{plan.description}</div>
                  </Label>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{plan.price}</div>
                  <div className="text-sm text-gray-500">
                    {plan.orderLimit ? `${plan.orderLimit} orders` : "Per order"}
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>
          
          <div className="mt-6">
            <Button 
              onClick={handlePlanChange}
              disabled={!selectedPlan || selectedPlan === restaurant?.subscription_plan || loading || isProcessing}
            >
              {isProcessing ? "Processing..." : 
               loading ? "Updating..." : 
               selectedPlan !== restaurant?.subscription_plan ? "Update Subscription" : "Current Plan"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Billing;