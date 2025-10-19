import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const TestSupabase = () => {
  const [testResult, setTestResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const testSupabase = async () => {
      try {
        console.log("Testing Supabase connection...");
        
        // Test basic connection
        const { data, error } = await supabase
          .from('restaurants')
          .select('count', { count: 'exact', head: true });
        
        if (error) {
          console.error("Supabase Error:", error);
          setTestResult(`Supabase Error: ${error.message}`);
        } else {
          console.log("Supabase Success:", data);
          setTestResult(`Supabase Connection Successful. Row count: ${data?.length || 0}`);
        }
      } catch (error) {
        console.error("Unexpected Error:", error);
        setTestResult(`Unexpected Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    testSupabase();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Supabase Test</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Connection Test</h2>
          {loading ? (
            <p className="text-gray-600">Testing connection...</p>
          ) : (
            <div className="p-4 bg-gray-50 rounded">
              <p className="font-mono text-sm">{testResult}</p>
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Environment Variables</h2>
          <div className="p-4 bg-gray-50 rounded">
            <p className="font-mono text-sm">
              VITE_SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL ? "Set" : "Not Set"}
            </p>
            <p className="font-mono text-sm">
              VITE_SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? "Set" : "Not Set"}
            </p>
          </div>
        </div>
        
        <div className="text-center">
          <a 
            href="/" 
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default TestSupabase;