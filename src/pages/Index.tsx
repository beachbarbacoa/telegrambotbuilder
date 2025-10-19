import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  // Test Supabase connection
  const testSupabase = async () => {
    try {
      const { data, error } = await supabase.from('restaurants').select('count').single();
      if (error) {
        console.log('Supabase connection error:', error);
      } else {
        console.log('Supabase connection successful:', data);
      }
    } catch (error) {
      console.log('Supabase connection failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Telegram Restaurant Bot</h1>
        <p className="text-xl text-gray-600 mb-8">
          Create your own Telegram ordering bot in minutes
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/auth/signup">
              Get Started - It's Free
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/auth/login">
              Login to Dashboard
            </Link>
          </Button>
        </div>
        
        {/* Test button for debugging - remove in production */}
        <div className="mt-4">
          <Button onClick={testSupabase} variant="link" size="sm">
            Test Supabase Connection
          </Button>
          <Button asChild variant="link" size="sm">
            <Link to="/auth/test">
              Connection Test (Debug)
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Easy Setup</h3>
            <p className="text-gray-600">
              Create your restaurant bot in under 10 minutes with our simple setup process.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Multiple Plans</h3>
            <p className="text-gray-600">
              Choose from monthly subscriptions or pay-per-order options that fit your business.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Full Control</h3>
            <p className="text-gray-600">
              Manage your menu, track orders, and view analytics from your dashboard.
            </p>
          </div>
        </div>
      </div>
      
      <MadeWithDyad />
    </div>
  );
};

export default Index;