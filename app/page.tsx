"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getVehicles } from "@/lib/store";
import { Vehicle } from "@/lib/types";
import {
  Search,
  Calendar,
  Shield,
  CreditCard,
  CheckCircle,
  Car,
  Sparkles,
  ArrowRight,
  Headphones,
  Award,
  User,
  ShieldCheck,
  UserPlus,
  LogIn,
} from "lucide-react";

export default function HomePage() {
  const [pickupDate, setPickupDate] = useState("2026-09-25");
  const [returnDate, setReturnDate] = useState("2026-09-29");
  const [category, setCategory] = useState("All");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    setVehicles(getVehicles());
    const onStoreUpdate = () => setVehicles(getVehicles());
    window.addEventListener("rcrms_store_updated", onStoreUpdate);
    return () => window.removeEventListener("rcrms_store_updated", onStoreUpdate);
  }, []);

  const availableCars = vehicles.filter((v) => v.status === "AVAILABLE");

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-slate-950 text-white overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-28">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 opacity-25 mix-blend-luminosity">
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2000&q=80"
            alt="Scenic road in Rwanda"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Rwanda&apos;s Premier Digital Car Rental System</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Explore Rwanda in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Comfort & Style</span>.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Instant car reservations, transparent daily rates, MoMo payment (*182#), and verified digital rental agreements for tourists, business travellers, and residents.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Zero Hidden Fees</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>MTN & Airtel MoMo Ready</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Verified Driving Licenses</span>
              </div>
            </div>
          </div>

          {/* Interactive Quick Search Widget */}
          <div className="mt-10 bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200 text-slate-900">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              {/* Pickup Date */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Pickup Date</span>
                </label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Return Date */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Return Date</span>
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-blue-600" />
                  <span>Vehicle Category</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="All">All Categories ({availableCars.length} Available)</option>
                  <option value="Compact SUV">Compact SUV</option>
                  <option value="Full-Size 4x4">Full-Size 4x4</option>
                  <option value="Luxury Sedan">Luxury Sedan</option>
                  <option value="Passenger Van">Passenger Van</option>
                </select>
              </div>

              {/* Submit CTA */}
              <div>
                <Link
                  href={`/cars?start=${pickupDate}&end=${returnDate}&category=${encodeURIComponent(
                    category
                  )}`}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl transition shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 group text-sm h-[44px]"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Fleet</span>
                </Link>
              </div>
            </div>

            {/* Live Fleet Availability Strip */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-semibold text-slate-700">Live Status:</span>
                <span>{availableCars.length} Vehicles Available for pickup in Kigali</span>
              </div>
              <div className="flex items-center gap-4 text-slate-600">
                <span>Airport Pickup Available</span>
                <span>•</span>
                <span>Chauffeur Optional</span>
                <span>•</span>
                <span>Instant MoMo Booking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two Dedicated Portals Section */}
      <section className="py-16 sm:py-20 bg-slate-100/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-blue-600 font-bold text-xs uppercase tracking-wider block mb-1">
              Secure System Portals
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Select Your Access Portal
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Customers must register an account to book vehicles. Managers use staff authentication to run fleet operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* 1. Customer Portal Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md hover:shadow-lg transition space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <User className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
                    Clients & Drivers
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                    Customer Portal
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Create an account first with your driving license. Reserve verified vehicles, track active bookings, view digital agreements, and settle balances with Mobile Money.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Driver account registration & verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Self-service booking management & receipts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Instant MTN & Airtel MoMo deposits</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                <Link
                  href="/customer/login"
                  className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Log In</span>
                </Link>
                <Link
                  href="/customer/register"
                  className="flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-blue-500/25"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </Link>
              </div>
            </div>

            {/* 2. Manager Portal Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md hover:shadow-lg transition space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-900/20 border border-slate-700">
                  <ShieldCheck className="w-7 h-7 text-amber-400" />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
                    Staff & Operations
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                    Manager Portal
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Fleet management suite for Kigali operations. Register vehicles, inspect customer bookings, access customer directories, record payments, and schedule maintenance.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Fleet inventory & vehicle QR codes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Customer directory & license tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Real-time revenue & P&L auditing</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Link
                  href="/manager/login"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition shadow-md"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Access Manager Portal &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-blue-400 font-bold text-xs uppercase tracking-wider block mb-2">
                The RentaGo Advantage
              </span>
              <h2 className="text-3xl sm:text-4xl font-black leading-tight mb-6">
                Engineered for Reliability Across Rwanda&apos;s Thousand Hills
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                From business trips in Kigali to safari expeditions across Akagera and Volcanoes National Park, our rental fleet undergoes routine servicing and multipoint inspections before every handover.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700">
                  <div className="font-bold text-sm text-white flex items-center gap-1.5 mb-1">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    Full Insurance Cover
                  </div>
                  <p className="text-slate-400">Comprehensive local third-party and accidental damage coverage.</p>
                </div>
                <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700">
                  <div className="font-bold text-sm text-white flex items-center gap-1.5 mb-1">
                    <CreditCard className="w-4 h-4 text-blue-400" />
                    MTN & Airtel MoMo
                  </div>
                  <p className="text-slate-400">Pay directly with *182# or mobile card reader on pickup.</p>
                </div>
                <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700">
                  <div className="font-bold text-sm text-white flex items-center gap-1.5 mb-1">
                    <Headphones className="w-4 h-4 text-amber-400" />
                    24/7 Roadside Assistance
                  </div>
                  <p className="text-slate-400">Breakdown recovery and replacement vehicles throughout Rwanda.</p>
                </div>
                <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700">
                  <div className="font-bold text-sm text-white flex items-center gap-1.5 mb-1">
                    <Award className="w-4 h-4 text-indigo-400" />
                    No Hidden Surcharges
                  </div>
                  <p className="text-slate-400">Transparent rates itemized in Rwandan Francs.</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80"
                  alt="Toyota Land Cruiser in Rwanda"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
