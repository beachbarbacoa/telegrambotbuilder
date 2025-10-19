"use client";

import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("ProtectedRoute: Checking authentication", { user, isLoading });
    if (!isLoading && !user) {
      console.log("ProtectedRoute: User not authenticated, redirecting to login");
      navigate("/auth/login");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    console.log("ProtectedRoute: Still loading");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  console.log("ProtectedRoute: Rendering children", { user: !!user });
  return user ? children : null;
};

export default ProtectedRoute;