"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  total_amount: number;
  status: string;
}

interface DailyStats {
  date: string;
  orders: number;
  revenue: number;
}

const Dashboard = () => {
  const { restaurant } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  // Get subscription plan name
  const getPlanName = (plan: string) => {
    switch (plan) {
      case 'monthly_50':
        return '50 Orders Plan';
      case 'monthly_125':
        return '125 Orders Plan';
      case 'monthly_unlimited':
        return 'Unlimited Plan';
      case 'pay_per_order':
        return 'Pay Per Order';
      default:
        return 'Unknown Plan';
    }
  };

  // Get subscription limit info
  const getSubscriptionInfo = () => {
    if (restaurant?.subscription_plan === 'monthly_unlimited') {
      return 'Unlimited orders';
    }
    
    if (restaurant?.subscription_plan === 'pay_per_order') {
      return `${restaurant.orders_used} orders this month`;
    }
    
    if (restaurant?.order_limit) {
      return `${restaurant.orders_used} / ${restaurant.order_limit} orders used`;
    }
    
    return 'Unknown';
  };

  useEffect(() => {
    if (restaurant) {
      fetchOrders();
      fetchDailyStats();
    }
  }, [restaurant, timeRange]);

  const fetchOrders = async () => {
    if (!restaurant) return;
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('id, created_at, customer_name, total_amount, status')
        .eq('restaurant_id', restaurant.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching orders:', error);
        return;
      }

      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchDailyStats = async () => {
    if (!restaurant) return;
    
    setLoading(true);
    
    try {
      // Calculate date range
      const endDate = new Date();
      let startDate = new Date();
      
      switch (timeRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
      }
      
      // Fetch daily stats
      const { data, error } = await supabase
        .from('orders')
        .select('created_at, total_amount, status')
        .eq('restaurant_id', restaurant.id)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (error) {
        console.error('Error fetching daily stats:', error);
        return;
      }

      // Process data into daily stats
      const statsMap: Record<string, { orders: number; revenue: number }> = {};
      
      // Initialize all days in range
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        statsMap[dateStr] = { orders: 0, revenue: 0 };
      }
      
      // Aggregate data
      data.forEach(order => {
        const dateStr = order.created_at.split('T')[0];
        if (statsMap[dateStr]) {
          statsMap[dateStr].orders += 1;
          statsMap[dateStr].revenue += order.total_amount;
        }
      });
      
      // Convert to array
      const statsArray = Object.entries(statsMap).map(([date, stats]) => ({
        date,
        orders: stats.orders,
        revenue: parseFloat(stats.revenue.toFixed(2))
      }));
      
      setDailyStats(statsArray);
    } catch (error) {
      console.error('Error fetching daily stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Status distribution data
  const statusData = [
    { name: 'Pending', value: orders.filter(o => o.status === 'pending').length },
    { name: 'Confirmed', value: orders.filter(o => o.status === 'confirmed').length },
    { name: 'Preparing', value: orders.filter(o => o.status === 'preparing').length },
    { name: 'Ready', value: orders.filter(o => o.status === 'ready').length },
    { name: 'Completed', value: orders.filter(o => o.status === 'completed').length },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Restaurant Dashboard</h1>
        {restaurant && (
          <Badge variant="secondary">
            {getPlanName(restaurant.subscription_plan)}
          </Badge>
        )}
      </div>

      {restaurant && (
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{restaurant.name}</h2>
                  <p className="text-gray-500">{restaurant.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Subscription Status</p>
                  <p className="font-medium">
                    {getSubscriptionInfo()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Today's Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold mb-4">
              {orders.filter(o => 
                new Date(o.created_at).toDateString() === new Date().toDateString()
              ).length}
            </p>
            <p className="text-gray-500">Orders today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Revenue (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold mb-4">
              ${dailyStats.reduce((sum, stat) => sum + stat.revenue, 0).toFixed(2)}
            </p>
            <p className="text-gray-500">Total revenue</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Orders Overview</CardTitle>
              <div className="flex space-x-2">
                <Button 
                  variant={timeRange === '7d' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setTimeRange('7d')}
                >
                  7D
                </Button>
                <Button 
                  variant={timeRange === '30d' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setTimeRange('30d')}
                >
                  30D
                </Button>
                <Button 
                  variant={timeRange === '90d' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setTimeRange('90d')}
                >
                  90D
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-80 flex items-center justify-center">
                <p>Loading...</p>
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent orders</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="flex justify-between items-center border-b pb-4">
                  <div>
                    <p className="font-medium">{order.customer_name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${order.total_amount.toFixed(2)}</p>
                    <Badge variant="secondary">{order.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;