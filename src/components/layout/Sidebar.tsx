"use client";

import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Utensils, CreditCard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Menu", path: "/dashboard/menu", icon: Utensils },
  { name: "Billing", path: "/dashboard/billing", icon: CreditCard },
  { name: "Settings", path: "/dashboard/settings", icon: Settings },
];

export const Sidebar = () => {
  const location = useLocation();
  
  return (
    <div className="w-64 bg-sidebar-background text-sidebar-foreground border-r border-sidebar-border h-screen fixed">
      <div className="p-4">
        <h1 className="text-xl font-bold">RestaurantBot</h1>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center px-4 py-3 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              location.pathname === item.path && "bg-sidebar-primary text-sidebar-primary-foreground"
            )}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};