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
    // Check current session on load
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      
      // If user is authenticated, fetch restaurant profile
      if (session?.user) {
        await fetchRestaurantProfile(session.user.id);
      }
      
      setIsLoading(false);
    };

    const fetchRestaurantProfile = async (userId: string) => {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setRestaurant(data);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        
        // Fetch restaurant profile when user logs in
        if (session?.user && event === 'SIGNED_IN') {
          await fetchRestaurantProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setRestaurant(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setRestaurant(null);
  };

  return (
    <AuthContext.Provider value={{ user, restaurant, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};