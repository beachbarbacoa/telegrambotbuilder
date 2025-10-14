"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const TestSupabase = () => {
  const [connectionStatus, setConnectionStatus] = useState("Checking...");
  const [error, setError] = useState("");
  const [tableStatus, setTableStatus] = useState("Checking...");
  const [tableError, setTableError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Try to get the Supabase URL from environment variables
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        
        if (!supabaseUrl) {
          setConnectionStatus("Failed");
          setError("VITE_SUPABASE_URL environment variable is not set");
          return;
        }
        
        setConnectionStatus("Success");
        
        // Test if restaurants table exists and has correct structure
        try {
          const { data, error } = await supabase
            .from('restaurants')
            .select('id')
            .limit(1);
            
          if (error) {
            setTableStatus("Failed");
            setTableError(`Database error: ${error.message}`);
          } else {
            setTableStatus("Success");
          }
        } catch (tableErr) {
          setTableStatus("Failed");
          setTableError(`Table error: ${tableErr.message}`);
        }
      } catch (err) {
        setConnectionStatus("Failed");
        setError(`Connection error: ${err.message}`);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Supabase Connection Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Connection Status:</h3>
              <p className={connectionStatus === "Success" ? "text-green-600" : "text-red-600"}>
                {connectionStatus}
              </p>
            </div>
            
            {error && (
              <div>
                <h3 className="font-medium">Error:</h3>
                <p className="text-red-600">{error}</p>
              </div>
            )}
            
            <div>
              <h3 className="font-medium">Restaurants Table Status:</h3>
              <p className={tableStatus === "Success" ? "text-green-600" : "text-red-600"}>
                {tableStatus}
              </p>
            </div>
            
            {tableError && (
              <div>
                <h3 className="font-medium">Table Error:</h3>
                <p className="text-red-600">{tableError}</p>
              </div>
            )}
            
            <Button 
              className="w-full" 
              onClick={() => navigate("/auth/signup")}
              disabled={connectionStatus !== "Success"}
            >
              Go to Signup
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestSupabase;