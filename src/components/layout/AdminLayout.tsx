"use client";

import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  BarChart3, 
  Settings,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const adminMenuItems = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Restaurants", path: "/admin/restaurants", icon: Users },
  { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
  { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", path: "/admin/settings", icon: Settings },
];

export const AdminLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className={`bg-gray-900 text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4 border-b border-gray-800">
          <h1 className={`text-xl font-bold ${sidebarOpen ? 'block' : 'hidden'}`}>Admin Panel</h1>
          {!sidebarOpen && <LayoutDashboard className="h-6 w-6" />}
        </div>
        
        <nav className="mt-6">
          {adminMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-4 py-3 hover:bg-gray-800 transition-colors",
                location.pathname === item.path && "bg-gray-800"
              )}
            >
              <item.icon className="h-5 w-5" />
              {sidebarOpen && <span className="ml-3">{item.name}</span>}
            </Link>
          ))}
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-gray-800">
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
          <Button 
            variant="ghost" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2"
          >
            <div className="w-6 h-6 flex flex-col justify-center">
              <div className="w-full h-0.5 bg-gray-600 mb-1"></div>
              <div className="w-full h-0.5 bg-gray-600 mb-1"></div>
              <div className="w-full h-0.5 bg-gray-600"></div>
            </div>
          </Button>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-500">Platform Administrator</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-300"></div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 p-6 bg-gray-50 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};