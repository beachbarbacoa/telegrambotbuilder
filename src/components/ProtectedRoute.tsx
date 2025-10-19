"use client";

const ProtectedRoute = ({ children }) => {
  // For debugging, let's just render the children without any authentication checks
  console.log("ProtectedRoute: Rendering children (simplified)");
  return children;
};

export default ProtectedRoute;
