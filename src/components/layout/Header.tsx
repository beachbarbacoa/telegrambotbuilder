"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-background border-b border-border h-16 flex items-center justify-between px-4">
      <h1 className="text-xl font-semibold">RestaurantBot</h1>
      {user && (
        <Button 
          variant="outline" 
          onClick={signOut}
          className="text-sm"
        >
          Logout
        </Button>
      )}
    </header>
  );
};