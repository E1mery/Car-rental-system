"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/components/AuthContext";
import { getVehicles, saveBooking } from "@/lib/store";
import { Booking, Vehicle } from "@/lib/types";
import { formatCurrency, calculateDaysBetween, formatDate } from "@/lib/utils";
import {
  CreditCard,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Lock,
  ArrowRight,
  Car,
  User,
  AlertCircle,
  LogIn,
  UserPlus,
  MapPin,
} from "lucide-react";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { customer, isCustomerAuth, isLoading } = useAuth();

  const vehicleId = searchParams.get("vehicleId") || "";
  const start = searchParams.get("start") || new Date().toISOString().split("T")[0];
  const end = searchParams.get("end") || new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0];
  const driverIncluded = searchParams.get("driver") === "1";
  const insuranceIncluded = searchParams.get("insurance") === "1";
  const pickup = searchParams.get("pickup") || "Kigali International Airport";

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Form states populated from customer account
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [notes, setNotes] = useState("");

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<"MOMO_MTN" | "MOMO_AIRTEL" | "CARD" | "CASH">("MOMO_MTN");
  const [momoPhone, setMomoPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const list = getVehicles();
    setVehicles(list);
    const found = list.find((v) => v.id === vehicleId) || list[0] || null;
    setSelectedVehicle(found);
  }, [vehicleId]);

  useEffect(() => {
    if (customer) {
      setFullName(customer.fullName);
      setEmail(customer.email);
      setPhone(customer.phone);
      setNationalId(customer.nationalId || "");
      setLicenseNumber(customer.licenseNumber);
      setMomoPhone(customer.phone);
    }
  }, [customer]);

  const days = calculateDaysBetween(start, end);
  const baseRate = selectedVehicle ? selectedVehicle.dailyRate : 50000;
  const baseTotal = baseRate * days;
  const driverFee = driverIncluded ? 10000 * days : 0;
  const insuranceFee = insuranceIncluded ? 3750 * days : 0;
  const grandTotal = baseTotal + driverFee + insuranceFee;
  const depositAmount = Math.min(100000, Math.round(grandTotal * 0.4));
  const balanceAmount = grandTotal - depositAmount;

  const currentUrl = typeof window !== "undefined" ? window.location.pathname + window.location.search : "/checkout";

  if (isLoading) {
    return (
      <div className="p-16 text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-500 font-semibold mt-3">Loading reservation...</p>
      </div>
    );
  }

  // Gate for unauthenticated customers
  if (!customer) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center border border-amber-200">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
              Customer Account Required
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              Please Sign In or Register to Reserve
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
              In accordance with Rwandan car rental regulations, all drivers must create and verify an account with their Driving License before confirming a reservation.
            </p>
          </div>

          {selectedVehicle && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left flex items-center gap-4">
              <div className="w-16 h-12 rounded-xl bg-slate-200 overflow-hidden shrink-0">
                <img
                  src={selectedVehicle.imageUrl || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=200&q=80"}
                  alt={selectedVehicle.model}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">{selectedVehicle.make} {selectedVehicle.model}</span>
                <span className="text-[11px] text-slate-500">{formatDate(start)} &rarr; {formatDate(end)} ({days} days) • {formatCurrency(grandTotal)}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Link
              href={`/customer/login?redirect=${encodeURIComponent(currentUrl)}`}
              className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-xs transition shadow-md"
            >
              <LogIn className="w-4 h-4" />
              <span>Log In to Account</span>
            </Link>

            <Link
              href={`/customer/register?redirect=${encodeURIComponent(currentUrl)}`}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition shadow-md shadow-blue-500/25"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register New Account</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle) return;

    setIsProcessing(true);

    setTimeout(() => {
      const bookingCode = `BK-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

      const newBooking: Booking = {
        id: `bk-${Date.now()}`,
        bookingCode,
        customerId: customer.id,
        customerName: customer.fullName,
        customerPhone: phone || customer.phone,
        customerEmail: customer.email,
        vehicleId: selectedVehicle.id,
        vehicleName: `${selectedVehicle.make} ${selectedVehicle.model}`,
        vehiclePlate: selectedVehicle.registrationNo,
        startDate: start,
        endDate: end,
        pickupLocation: pickup,
        returnLocation: "Kigali Headquarters",
        dailyRate: baseRate,
        totalDays: days,
        baseRentalFee: baseTotal,
        driverFee,
        insuranceFee,
        extraFees: 0,
        totalAmount: grandTotal,
        depositAmount,
        balanceAmount,
        status: "CONFIRMED",
        notes,
        createdAt: new Date().toISOString().split("T")[0],
      };

      saveBooking(newBooking);
      setIsProcessing(false);

      router.push(
        `/booking-confirmation?code=${bookingCode}&name=${encodeURIComponent(
          customer.fullName
        )}&vehicle=${encodeURIComponent(`${selectedVehicle.make} ${selectedVehicle.model}`)}&total=${grandTotal}&deposit=${depositAmount}&balance=${balanceAmount}`
      );
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold mb-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Authenticated as {customer.fullName} ({customer.licenseNumber})</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Confirm Reservation & Deposit
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review your driver credentials and complete your instant deposit with Mobile Money or Card
        </p>
      </div>

      <form onSubmit={handleSubmitBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Customer & Payment Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Information Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-sm font-bold text-slate-900">
              <User className="w-4 h-4 text-blue-600" />
              <span>1. Verified Driver Credentials</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (MoMo) *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Driving License Number *</label>
                <input
                  type="text"
                  required
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 uppercase focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Pickup Notes / Flight Arrival</label>
              <input
                type="text"
                placeholder="e.g. Flight WB 402 arrival at Kigali Airport or hotel delivery"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>2. Deposit Payment (MoMo / Card)</span>
              </div>
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Deposit Due: {formatCurrency(depositAmount)}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod("MOMO_MTN")}
                className={`p-3 rounded-2xl border text-center transition font-bold text-xs ${
                  paymentMethod === "MOMO_MTN"
                    ? "bg-amber-500 text-slate-900 border-amber-600 ring-2 ring-amber-400/40"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                MTN MoMo
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("MOMO_AIRTEL")}
                className={`p-3 rounded-2xl border text-center transition font-bold text-xs ${
                  paymentMethod === "MOMO_AIRTEL"
                    ? "bg-rose-600 text-white border-rose-700 ring-2 ring-rose-400/40"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                Airtel Money
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("CARD")}
                className={`p-3 rounded-2xl border text-center transition font-bold text-xs ${
                  paymentMethod === "CARD"
                    ? "bg-blue-600 text-white border-blue-700 ring-2 ring-blue-400/40"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                Debit / Credit Card
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("CASH")}
                className={`p-3 rounded-2xl border text-center transition font-bold text-xs ${
                  paymentMethod === "CASH"
                    ? "bg-slate-900 text-white border-slate-800 ring-2 ring-slate-400/40"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                Pay at Counter
              </button>
            </div>

            {(paymentMethod === "MOMO_MTN" || paymentMethod === "MOMO_AIRTEL") && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Enter Mobile Money Phone Number for USSD Push
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={momoPhone}
                    onChange={(e) => setMomoPhone(e.target.value)}
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  You will receive a prompt on your phone to enter your MoMo PIN to authorize {formatCurrency(depositAmount)}.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Summary Box (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <h3 className="font-black text-base text-slate-900 pb-3 border-b border-slate-100">
              Reservation Summary
            </h3>

            {selectedVehicle ? (
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={selectedVehicle.imageUrl || ""}
                    alt={selectedVehicle.model}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {selectedVehicle.make} {selectedVehicle.model}
                  </h4>
                  <span className="text-xs text-slate-500 block">{selectedVehicle.categoryName || "SUV"} • {selectedVehicle.year}</span>
                  <span className="font-mono text-xs font-bold text-blue-600">{selectedVehicle.registrationNo}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No vehicle selected.</p>
            )}

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Rental Dates:</span>
                <span className="font-bold text-slate-800">{formatDate(start)} &rarr; {formatDate(end)}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="font-bold text-slate-800">{days} Days</span>
              </div>
              <div className="flex justify-between">
                <span>Pickup Station:</span>
                <span className="font-bold text-slate-800">{pickup}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-100">
                <span>Base Daily Rate:</span>
                <span>{formatCurrency(baseRate)} &times; {days} days</span>
              </div>
              {driverIncluded && (
                <div className="flex justify-between text-indigo-600 font-semibold">
                  <span>Professional Driver:</span>
                  <span>+{formatCurrency(driverFee)}</span>
                </div>
              )}
              {insuranceIncluded && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Zero-Excess Insurance:</span>
                  <span>+{formatCurrency(insuranceFee)}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-slate-200 text-base font-black text-slate-900">
                <span>Total Amount:</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
              <div className="flex justify-between pt-1 font-bold text-emerald-600 text-xs">
                <span>Deposit Payable Now:</span>
                <span>{formatCurrency(depositAmount)}</span>
              </div>
              <div className="flex justify-between font-bold text-amber-600 text-xs">
                <span>Balance on Handover:</span>
                <span>{formatCurrency(balanceAmount)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing || !selectedVehicle}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-2xl transition shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Confirming reservation...</span>
              ) : (
                <>
                  <span>Authorize Deposit ({formatCurrency(depositAmount)})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Loading checkout...</div>}>
          <CheckoutContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
