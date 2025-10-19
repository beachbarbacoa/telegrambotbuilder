"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface RestaurantProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  subscription_plan: string;
  payment_method: string;
  status: string;
  telegram_bot_username?: string;
  order_limit: number | null;
  orders_used: number;
}

const AuthContext = createContext({
  user: null,
  restaurant: null,
  isLoading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [restaurant, setRestaurant] = useState<RestaurantProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("AuthProvider: Initializing");
    
    // Simple initialization without Supabase calls
    setIsLoading(false);
    console.log("AuthProvider: Initialization complete");
  }, []);

  const signOut = async () => {
    console.log("AuthProvider: Signing out");
    setRestaurant(null);
  };

  console.log("AuthProvider: Rendering with state", { user, restaurant, isLoading });

  return (
    <AuthContext.Provider value={{ user, restaurant, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};