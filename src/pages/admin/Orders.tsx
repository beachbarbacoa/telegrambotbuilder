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
import { Search, Filter } from "lucide-react";

// Mock data for orders
const mockOrders = [
  {
    id: "1001",
    restaurant: "Mario's Italian Kitchen",
    customer: "John Smith",
    items: 3,
    total: 42.50,
    status: "completed",
    date: "2023-06-15 18:30:00",
  },
  {
    id: "1002",
    restaurant: "Burger Palace",
    customer: "Sarah Johnson",
    items: 2,
    total: 18.75,
    status: "preparing",
    date: "2023-06-15 19:15:00",
  },
  {
    id: "1003",
    restaurant: "Sushi Express",
    customer: "Mike Wilson",
    items: 5,
    total: 32.00,
    status: "pending",
    date: "2023-06-15 19:45:00",
  },
  {
    id: "1004",
    restaurant: "Taco Fiesta",
    customer: "Emily Davis",
    items: 4,
    total: 26.25,
    status: "ready",
    date: "2023-06-15 20:00:00",
  },
];

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders] = useState(mockOrders);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending": return "secondary";
      case "preparing": return "default";
      case "ready": return "outline";
      case "completed": return "default";
      default: return "default";
    }
  };

  const filteredOrders = orders.filter(order =>
    order.id.includes(searchTerm) ||
    order.restaurant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="flex space-x-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Restaurant</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">#{order.id}</TableCell>
                <TableCell>{order.restaurant}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.items}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(order.date).toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    View
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

export default Orders;