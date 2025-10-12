"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Restaurant Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold mb-4">0</p>
            <p className="text-gray-500">Today's orders</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold mb-4">$0</p>
            <p className="text-gray-500">Today's revenue</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Menu Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold mb-4">0</p>
            <p className="text-gray-500">Active menu items</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button>Manage Menu</Button>
            <Button variant="secondary">View Orders</Button>
            <Button variant="outline">Analytics</Button>
            <Button variant="outline">Settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;