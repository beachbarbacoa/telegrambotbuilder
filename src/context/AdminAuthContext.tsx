"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminAuthContext = createContext({
  isAdmin: false,
  isLoading: true,
  login: async (email: string, password: string) => { return false; },
  logout: () => {},
});

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const checkAdminSession = () => {
      const adminSession = localStorage.getItem("admin_session");
      setIsAdmin(!!adminSession);
      setIsLoading(false);
    };

    checkAdminSession();
  }, []);

  const login = async (email: string, password: string) => {
    // In a real implementation, this would authenticate with your backend
    // For demo purposes, we'll just check for admin credentials
    if (email === "admin@restaurantbot.com" && password === "admin123") {
      localStorage.setItem("admin_session", "true");
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("admin_session");
    setIsAdmin(false);
    navigate("/admin/login");
  };

  return (
    <AdminAuthContext.Provider value={{ isAdmin, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};