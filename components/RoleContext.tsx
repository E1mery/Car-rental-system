"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Role } from "@/lib/types";

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  userEmail: string;
  userName: string;
}

const RoleContext = createContext<RoleContextType>({
  role: "ADMIN",
  setRole: () => {},
  userEmail: "admin@rentago.rw",
  userName: "System Administrator",
});

const ROLE_USER_MAP: Record<Role, { name: string; email: string }> = {
  ADMIN: { name: "System Admin (Kigali HQ)", email: "admin@rentago.rw" },
  MANAGER: { name: "Fleet Manager", email: "manager@rentago.rw" },
  RENTAL_AGENT: { name: "Rental Agent (Airport)", email: "agent@rentago.rw" },
  CUSTOMER: { name: "Alice Uwase (Customer)", email: "alice.uwase@techrwanda.rw" },
};

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>("ADMIN");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedRole = localStorage.getItem("rcrms_active_role") as Role;
    if (savedRole && ROLE_USER_MAP[savedRole]) {
      setRoleState(savedRole);
    }
    setMounted(true);
  }, []);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    if (typeof window !== "undefined") {
      localStorage.setItem("rcrms_active_role", newRole);
    }
  };

  const currentUser = ROLE_USER_MAP[role];

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        userName: currentUser.name,
        userEmail: currentUser.email,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export const useRole = () => useContext(RoleContext);
