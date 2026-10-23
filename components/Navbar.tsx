"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Car,
  PhoneCall,
  ShieldCheck,
  Menu,
  X,
  User,
  LayoutDashboard,
  LogOut,
  UserPlus,
  LogIn,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "./AuthContext";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { customer, manager, logoutCustomer, logoutManager } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [customerMenuOpen, setCustomerMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Fleet & Cars", href: "/cars" },
  ];

  const handleCustomerLogout = () => {
    logoutCustomer();
    setCustomerMenuOpen(false);
    router.push("/");
  };

  const handleManagerLogout = () => {
    logoutManager();
    router.push("/");
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Renta<span className="text-blue-600">Go</span>
                </span>
                <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-blue-200">
                  RWANDA
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-none">
                Car Rental Management System
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    active
                      ? "text-blue-600 bg-blue-50/80 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-600 border-r border-slate-200 pr-3">
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="text-[10px] text-slate-600 block leading-tight">Support Hotline</span>
                <span className="font-bold text-slate-800">+250 788 123 456</span>
              </div>
            </div>

            {/* Customer Session */}
            {customer ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/customer"
                  className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold px-3.5 py-2 rounded-xl border border-blue-200 transition"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black">
                    {customer.fullName.charAt(0).toUpperCase()}
                  </div>
                  <span>{customer.fullName.split(" ")[0]} (Portal)</span>
                </Link>
                <button
                  onClick={handleCustomerLogout}
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <Link
                  href="/customer/login"
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-slate-100 transition"
                >
                  <User className="w-4 h-4 text-blue-600" />
                  <span>Customer Portal</span>
                </Link>
              </div>
            )}

            {/* Manager Session / Portal */}
            {manager ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/manager"
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm transition"
                >
                  <LayoutDashboard className="w-4 h-4 text-amber-400" />
                  <span>Manager Portal</span>
                </Link>
                <button
                  onClick={handleManagerLogout}
                  title="Sign Out Manager"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/manager/login"
                className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition border border-slate-200"
              >
                <ShieldCheck className="w-4 h-4 text-slate-700" />
                <span>Manager Portal</span>
              </Link>
            )}

            <Link
              href="/cars"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm shadow-emerald-600/20"
            >
              Book a Car
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center md:hidden gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {customer ? (
              <div className="flex items-center justify-between bg-blue-50 p-2.5 rounded-xl border border-blue-200">
                <Link
                  href="/customer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-bold text-sm text-blue-800 flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-blue-600" />
                  <span>Customer Portal ({customer.fullName.split(" ")[0]})</span>
                </Link>
                <button
                  onClick={handleCustomerLogout}
                  className="text-xs font-bold text-rose-600 px-2 py-1 bg-white rounded border border-rose-200"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/customer/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center bg-blue-50 text-blue-700 py-2.5 rounded-lg font-bold text-xs border border-blue-200"
                >
                  Customer Sign In
                </Link>
                <Link
                  href="/customer/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center bg-blue-600 text-white py-2.5 rounded-lg font-bold text-xs"
                >
                  Register Account
                </Link>
              </div>
            )}

            {manager ? (
              <div className="flex items-center justify-between bg-slate-900 text-white p-2.5 rounded-xl">
                <Link
                  href="/manager"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-bold text-sm flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4 text-amber-400" />
                  <span>Manager Portal</span>
                </Link>
                <button
                  onClick={handleManagerLogout}
                  className="text-xs font-bold text-rose-400 px-2 py-1 bg-slate-800 rounded border border-slate-700"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/manager/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-slate-900 text-white py-2.5 rounded-lg font-bold text-xs"
              >
                Manager Portal Sign In
              </Link>
            )}

            <Link
              href="/cars"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-emerald-600 text-white py-2.5 rounded-lg font-bold text-sm shadow-sm"
            >
              Browse Fleet & Book
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
