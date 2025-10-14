"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2 } from "lucide-react";

// Mock data for restaurants
const mockRestaurants = [
  {
    id: "1",
    name: "Mario's Italian Kitchen",
    email: "contact@marios.com",
    plan: "monthly_unlimited",
    status: "active",
    orders: 124,
    revenue: 4250.75,
  },
  {
    id: "2",
    name: "Burger Palace",
    email: "info@burgerpalace.com",
    plan: "monthly_125",
    status: "active",
    orders: 87,
    revenue: 2150.30,
  },
  {
    id: "3",
    name: "Sushi Express",
    email: "hello@sushiexpress.com",
    plan: "pay_per_order",
    status: "inactive",
    orders: 42,
    revenue: 1260.00,
  },
  {
    id: "4",
    name: "Taco Fiesta",
    email: "orders@tacofiesta.com",
    plan: "monthly_50",
    status: "active",
    orders: 68,
    revenue: 1780.25,
  },
];

const Restaurants = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [restaurants] = useState(mockRestaurants);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "inactive": return "secondary";
      default: return "default";
    }
  };

  const getPlanName = (plan: string) => {
    switch (plan) {
      case "monthly_50": return "50 Orders";
      case "monthly_125": return "125 Orders";
      case "monthly_unlimited": return "Unlimited";
      case "pay_per_order": return "Pay Per Order";
      default: return plan;
    }
  };

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Restaurants</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Restaurant
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search restaurants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Restaurant</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRestaurants.map((restaurant) => (
              <TableRow key={restaurant.id}>
                <TableCell className="font-medium">{restaurant.name}</TableCell>
                <TableCell>{restaurant.email}</TableCell>
                <TableCell>{getPlanName(restaurant.plan)}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(restaurant.status)}>
                    {restaurant.status}
                  </Badge>
                </TableCell>
                <TableCell>{restaurant.orders}</TableCell>
                <TableCell>${restaurant.revenue.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Restaurants;