import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Telegram Restaurant Bot</h1>
        <p className="text-xl text-gray-600 mb-8">
          Create your own Telegram ordering bot in minutes
        </p>
        <p className="text-gray-500">Simplified version for debugging</p>
      </div>
    </div>
  );
};

export default Index;
