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
    
    // Check current session on load
    const checkSession = async () => {
      console.log("AuthProvider: Checking session");
      const { data: { session } } = await supabase.auth.getSession();
      console.log("AuthProvider: Session check result", session);
      setUser(session?.user || null);
      
      // If user is authenticated, fetch restaurant profile
      if (session?.user) {
        console.log("AuthProvider: User authenticated, fetching restaurant profile");
        await fetchRestaurantProfile(session.user.id);
      }
      
      setIsLoading(false);
      console.log("AuthProvider: Initialization complete");
    };

    const fetchRestaurantProfile = async (userId: string) => {
      console.log("AuthProvider: Fetching restaurant profile for user", userId);
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("AuthProvider: Error fetching restaurant profile", error);
      } else if (data) {
        console.log("AuthProvider: Restaurant profile fetched", data);
        setRestaurant(data);
      } else {
        console.log("AuthProvider: No restaurant profile found");
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("AuthProvider: Auth state changed", event, session?.user?.id);
        setUser(session?.user || null);
        
        // Fetch restaurant profile when user logs in
        if (session?.user && event === 'SIGNED_IN') {
          console.log("AuthProvider: User signed in, fetching restaurant profile");
          await fetchRestaurantProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          console.log("AuthProvider: User signed out");
          setRestaurant(null);
        }
      }
    );

    return () => {
      console.log("AuthProvider: Unsubscribing from auth state changes");
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    console.log("AuthProvider: Signing out");
    await supabase.auth.signOut();
    setRestaurant(null);
  };

  console.log("AuthProvider: Rendering with state", { user, restaurant, isLoading });

  return (
    <AuthContext.Provider value={{ user, restaurant, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};