import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TestSupabase from "./pages/auth/TestSupabase";

console.log("App: Initializing");

const App = () => {
  console.log("App: Rendering simplified version");
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth/test" element={<TestSupabase />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
