"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import {
  LayoutDashboard,
  Car,
  CalendarCheck,
  Users,
  CreditCard,
  Wrench,
  BarChart3,
  Bell,
  ArrowLeft,
  ChevronRight,
  Menu,
  X,
  ShieldCheck,
  LogOut,
  User,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { manager, isManagerAuth, isLoading, logoutManager } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Protect Manager Portal Route
  useEffect(() => {
    if (!isLoading && !isManagerAuth) {
      router.push("/manager/login");
    }
  }, [isLoading, isManagerAuth, router]);

  const handleLogout = () => {
    logoutManager();
    router.push("/manager/login");
  };

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Fleet & Vehicles", href: "/admin/vehicles", icon: Car },
    { label: "Bookings & Rentals", href: "/admin/bookings", icon: CalendarCheck },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Payments & Invoices", href: "/admin/payments", icon: CreditCard },
    { label: "Maintenance & Service", href: "/admin/maintenance", icon: Wrench },
    { label: "Reports & Analytics", href: "/admin/reports", icon: BarChart3 },
  ];

  if (isLoading || !manager) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400 font-semibold">Verifying Manager Access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-white text-base leading-none block">
                Renta<span className="text-blue-500">Go</span>
              </span>
              <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
                Manager Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Current Manager User Badge */}
        <div className="px-4 py-3 bg-slate-800/60 border-b border-slate-800/80 mx-3 my-3 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-white block truncate">{manager.name}</span>
              <span className="text-[10px] text-amber-400 font-semibold block">{manager.email}</span>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  active
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {active && <ChevronRight className="w-3.5 h-3.5" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-800 space-y-1.5">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Public Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-950/40 rounded-xl transition"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Sign Out Manager</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 z-30 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <span className="text-xs text-slate-400 font-medium">Enterprise Fleet Operations</span>
              <h2 className="text-sm font-extrabold text-slate-800">Manager Control Suite • Kigali HQ</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/cars"
              target="_blank"
              className="bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold px-3 py-1.5 rounded-lg border border-blue-200 transition hidden sm:inline-block"
            >
              Live Fleet View ↗
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-bold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-200 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Page Content Scrollable Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex flex-col w-64 bg-slate-900 text-slate-300 p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold text-white text-sm">Manager Portal</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                      active ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-slate-800 rounded-xl"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
