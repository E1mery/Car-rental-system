"use client";

import React from "react";
import { useRole } from "./RoleContext";
import { Role } from "@/lib/types";
import { Shield, UserCheck, Briefcase, User, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function RoleSwitcher() {
  const { role, setRole, userName } = useRole();
  const pathname = usePathname();

  const roles: { key: Role; label: string; icon: any; color: string; desc: string }[] = [
    {
      key: "ADMIN",
      label: "Admin",
      icon: Shield,
      color: "bg-rose-500/15 text-rose-700 border-rose-300",
      desc: "Full system & fleet authority",
    },
    {
      key: "MANAGER",
      label: "Manager",
      icon: Briefcase,
      color: "bg-indigo-500/15 text-indigo-700 border-indigo-300",
      desc: "Business performance & fleet",
    },
    {
      key: "RENTAL_AGENT",
      label: "Rental Agent",
      icon: UserCheck,
      color: "bg-blue-500/15 text-blue-700 border-blue-300",
      desc: "Pickups, returns & agreements",
    },
    {
      key: "CUSTOMER",
      label: "Customer",
      icon: User,
      color: "bg-emerald-500/15 text-emerald-700 border-emerald-300",
      desc: "Search, book & view rentals",
    },
  ];

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 text-xs py-2 px-4 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-slate-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Active Role:
          </span>
          <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            {userName}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-400 mr-1 hidden sm:inline">Switch Role:</span>
          {roles.map((r) => {
            const Icon = r.icon;
            const isActive = role === r.key;
            return (
              <button
                key={r.key}
                onClick={() => setRole(r.key)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium border ${
                  isActive
                    ? "bg-blue-600 text-white border-blue-500 shadow-sm ring-2 ring-blue-400/30"
                    : "bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700"
                }`}
                title={r.desc}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{r.label}</span>
              </button>
            );
          })}

          <div className="ml-2 pl-2 border-l border-slate-700 flex items-center gap-2">
            {role !== "CUSTOMER" ? (
              <Link
                href="/admin"
                className={`px-2.5 py-1 rounded font-semibold transition ${
                  pathname.startsWith("/admin")
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-800 text-emerald-400 hover:bg-slate-700"
                }`}
              >
                Staff Portal &rarr;
              </Link>
            ) : (
              <Link
                href="/portal"
                className={`px-2.5 py-1 rounded font-semibold transition ${
                  pathname.startsWith("/portal")
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-800 text-emerald-400 hover:bg-slate-700"
                }`}
              >
                My Account &rarr;
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
