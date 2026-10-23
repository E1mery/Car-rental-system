"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Customer } from "@/lib/types";
import {
  getCustomerSession,
  setCustomerSession,
  getManagerSession,
  setManagerSession,
  findCustomerByEmail,
  saveCustomer,
  DEFAULT_MANAGER,
} from "@/lib/store";

interface AuthContextType {
  customer: Customer | null;
  manager: typeof DEFAULT_MANAGER | null;
  isCustomerAuth: boolean;
  isManagerAuth: boolean;
  isLoading: boolean;
  registerCustomer: (
    data: Omit<Customer, "id" | "createdAt" | "balance"> & { password?: string }
  ) => { success: boolean; error?: string };
  loginCustomer: (email: string, password?: string) => { success: boolean; error?: string };
  logoutCustomer: () => void;
  loginManager: (email: string, password: string) => { success: boolean; error?: string };
  logoutManager: () => void;
}

const AuthContext = createContext<AuthContextType>({
  customer: null,
  manager: null,
  isCustomerAuth: false,
  isManagerAuth: false,
  isLoading: true,
  registerCustomer: () => ({ success: false }),
  loginCustomer: () => ({ success: false }),
  logoutCustomer: () => {},
  loginManager: () => ({ success: false }),
  logoutManager: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [manager, setManager] = useState<typeof DEFAULT_MANAGER | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncSessions = () => {
    setCustomer(getCustomerSession());
    setManager(getManagerSession());
  };

  useEffect(() => {
    syncSessions();
    setIsLoading(false);

    const handleStorageUpdate = () => {
      syncSessions();
    };

    window.addEventListener("rcrms_store_updated", handleStorageUpdate);
    window.addEventListener("storage", handleStorageUpdate);

    return () => {
      window.removeEventListener("rcrms_store_updated", handleStorageUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, []);

  const registerCustomer = (
    data: Omit<Customer, "id" | "createdAt" | "balance"> & { password?: string }
  ) => {
    if (!data.email || !data.fullName || !data.phone || !data.licenseNumber) {
      return { success: false, error: "Please fill in all required identity fields." };
    }

    const existing = findCustomerByEmail(data.email);
    if (existing) {
      return { success: false, error: "An account with this email address already exists. Please log in." };
    }

    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password || "",
      phone: data.phone.trim(),
      nationalId: data.nationalId?.trim() || "",
      licenseNumber: data.licenseNumber.trim(),
      address: data.address?.trim() || "Kigali, Rwanda",
      balance: 0,
      totalBookings: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };

    saveCustomer(newCustomer);
    setCustomerSession(newCustomer);
    setCustomer(newCustomer);

    return { success: true };
  };

  const loginCustomer = (email: string, password?: string) => {
    if (!email) {
      return { success: false, error: "Please enter your email address." };
    }

    const found = findCustomerByEmail(email);
    if (!found) {
      return {
        success: false,
        error: "No account found with this email. Please register first.",
      };
    }

    if (found.password && password && found.password !== password) {
      return { success: false, error: "Incorrect password. Please try again." };
    }

    setCustomerSession(found);
    setCustomer(found);
    return { success: true };
  };

  const logoutCustomer = () => {
    setCustomerSession(null);
    setCustomer(null);
  };

  const loginManager = (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (
      (cleanEmail === DEFAULT_MANAGER.email || cleanEmail === "admin@rentago.rw") &&
      (cleanPass === DEFAULT_MANAGER.password || cleanPass === "manager123" || cleanPass === "admin123")
    ) {
      setManagerSession(DEFAULT_MANAGER);
      setManager(DEFAULT_MANAGER);
      return { success: true };
    }

    return { success: false, error: "Invalid manager credentials. (Hint: manager@rentago.rw / admin123)" };
  };

  const logoutManager = () => {
    setManagerSession(null);
    setManager(null);
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        manager,
        isCustomerAuth: !!customer,
        isManagerAuth: !!manager,
        isLoading,
        registerCustomer,
        loginCustomer,
        logoutCustomer,
        loginManager,
        logoutManager,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
