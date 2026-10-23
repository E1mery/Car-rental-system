"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CheckCircle2, Calendar, MapPin, Printer, ArrowRight, User } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "BK-2026-001";
  const name = searchParams.get("name") || "Jean Paul Mugisha";
  const vehicle = searchParams.get("vehicle") || "Toyota RAV4 (2023)";
  const total = Number(searchParams.get("total") || "255000");
  const deposit = Number(searchParams.get("deposit") || "100000");
  const balance = Number(searchParams.get("balance") || "155000");

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
            {/* Success Icon */}
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-emerald-600 font-bold text-xs uppercase tracking-wider block mb-1">
                Reservation Confirmed
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                You&apos;re All Set for the Road!
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                An SMS confirmation and booking voucher have been sent to your phone.
              </p>
            </div>

            {/* Booking Reference Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2.5">
                <span className="text-slate-500 font-sans">Booking Code:</span>
                <span className="text-base font-black text-blue-600">{code}</span>
              </div>
              <div className="flex justify-between items-center text-slate-700">
                <span className="font-sans">Customer:</span>
                <span className="font-bold">{name}</span>
              </div>
              <div className="flex justify-between items-center text-slate-700">
                <span className="font-sans">Reserved Vehicle:</span>
                <span className="font-bold">{vehicle}</span>
              </div>
              <div className="flex justify-between items-center text-slate-700">
                <span className="font-sans">Deposit Paid:</span>
                <span className="font-bold text-emerald-600">{formatCurrency(deposit)} (MoMo Verified)</span>
              </div>
              <div className="flex justify-between items-center text-slate-700">
                <span className="font-sans">Balance on Pickup:</span>
                <span className="font-bold text-amber-600">{formatCurrency(balance)}</span>
              </div>
            </div>

            {/* Handover Instructions */}
            <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 text-left text-xs text-slate-700 space-y-2">
              <h4 className="font-bold text-blue-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Vehicle Pickup Instructions</span>
              </h4>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Please present your original driving license and National ID/Passport at our Kigali International Airport counter or Nyarutarama depot. Our agent will conduct a 2-minute digital vehicle condition walkaround before handing over the keys.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={handlePrint}
                className="w-full sm:w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Booking Voucher</span>
              </button>

              <Link
                href="/portal"
                className="w-full sm:w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition shadow-md shadow-blue-500/25 flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>Go to Customer Portal</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-500">Loading booking summary...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
