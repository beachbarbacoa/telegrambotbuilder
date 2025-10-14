"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { PaymentService } from "@/services/paymentService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Payment {
  id: string;
  order_id: string | null;
  restaurant_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  transaction_id: string;
  status: string;
  payment_intent_id: string;
  refunded_amount: number;
  fees_deducted: number;
  created_at: string;
}

const Payments = () => {
  const { restaurant } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (restaurant) {
      fetchPaymentHistory();
    }
  }, [restaurant]);

  const fetchPaymentHistory = async () => {
    if (!restaurant) return;
    
    try {
      const result = await PaymentService.getPaymentHistory(restaurant.id);
      if (result.success && result.payments) {
        setPayments(result.payments as Payment[]);
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "succeeded": return "default";
      case "pending": return "secondary";
      case "failed": return "destructive";
      case "refunded": return "outline";
      default: return "default";
    }
  };

  const getPaymentType = (orderId: string | null) => {
    return orderId ? "Order Payment" : "Subscription";
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p>Loading payment history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Payment History</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No payment history found</p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Fees</TableHead>
                    <TableHead>Net Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {format(new Date(payment.created_at), 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                      <TableCell>{getPaymentType(payment.order_id)}</TableCell>
                      <TableCell>${payment.amount.toFixed(2)}</TableCell>
                      <TableCell>${payment.fees_deducted.toFixed(2)}</TableCell>
                      <TableCell className="font-medium">
                        ${(payment.amount - payment.fees_deducted).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(payment.status)}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;