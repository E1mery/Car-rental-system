"use client";

import React, { useState } from "react";
import { Vehicle } from "@/lib/types";
import { formatCurrency, calculateDaysBetween } from "@/lib/utils";
import { Calendar, UserCheck, ShieldCheck, Check, Calculator, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PriceCalculatorProps {
  vehicle: Vehicle;
  initialStart?: string;
  initialEnd?: string;
  onProceedToCheckout?: (data: any) => void;
}

export function PriceCalculator({
  vehicle,
  initialStart = "2026-09-25",
  initialEnd = "2026-09-29",
  onProceedToCheckout,
}: PriceCalculatorProps) {
  const [startDate, setStartDate] = useState(initialStart);
  const [endDate, setEndDate] = useState(initialEnd);
  const [includeDriver, setIncludeDriver] = useState(true);
  const [includeInsurance, setIncludeInsurance] = useState(true);
  const [pickupLocation, setPickupLocation] = useState("Kigali International Airport");

  const days = calculateDaysBetween(startDate, endDate);

  // Math exactly following the prompt specification
  const dailyRate = vehicle.dailyRate;
  const baseRental = dailyRate * days;
  const driverRatePerDay = 10000;
  const driverFee = includeDriver ? driverRatePerDay * days : 0;
  const insuranceRatePerDay = 3750;
  const insuranceFee = includeInsurance ? insuranceRatePerDay * days : 0;
  
  const totalAmount = baseRental + driverFee + insuranceFee;
  // Standard deposit: around 100,000 RWF or proportional
  const depositAmount = Math.min(100000, Math.round(totalAmount * 0.4));
  const balanceAmount = totalAmount - depositAmount;

  const checkoutQuery = new URLSearchParams({
    vehicleId: vehicle.id,
    start: startDate,
    end: endDate,
    driver: includeDriver ? "1" : "0",
    insurance: includeInsurance ? "1" : "0",
    pickup: pickupLocation,
    base: baseRental.toString(),
    driverFee: driverFee.toString(),
    insuranceFee: insuranceFee.toString(),
    total: totalAmount.toString(),
    deposit: depositAmount.toString(),
    balance: balanceAmount.toString(),
  }).toString();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6">
      <div className="flex items-center gap-2 mb-4 text-blue-600 font-semibold text-sm">
        <Calculator className="w-5 h-5" />
        <span>Instant Cost & Deposit Breakdown</span>
      </div>

      <div className="space-y-4">
        {/* Date Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Pickup Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Return Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Pickup Location */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Pickup & Handover Location
          </label>
          <select
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="Kigali International Airport">Kigali International Airport (KGL Terminal)</option>
            <option value="Kigali Convention Centre">Kigali Convention Centre (KCC)</option>
            <option value="Kigali Headquarters">Nyarutarama Head Office</option>
            <option value="Hotel Delivery">Hotel Delivery (Within Kigali)</option>
          </select>
        </div>

        {/* Add-ons Checklist */}
        <div className="pt-2 border-t border-slate-100 space-y-2.5">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Optional Extras
          </span>

          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-300 cursor-pointer transition bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={includeDriver}
                onChange={(e) => setIncludeDriver(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <div>
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Professional Chauffeur / Driver</span>
                </div>
                <span className="text-[11px] text-slate-500">Experienced English & French speaking guide</span>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-700">+10,000 RWF/day</span>
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-300 cursor-pointer transition bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={includeInsurance}
                onChange={(e) => setIncludeInsurance(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <div>
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Comprehensive Zero-Excess Insurance</span>
                </div>
                <span className="text-[11px] text-slate-500">Protection against windshield, tire, collision</span>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-700">+3,750 RWF/day</span>
          </label>
        </div>

        {/* Calculation Summary matching the exact prompt formula */}
        <div className="bg-slate-900 text-white rounded-xl p-4 font-mono text-xs space-y-2 mt-4 shadow-inner">
          <div className="flex justify-between text-slate-300">
            <span>Rental ({formatCurrency(dailyRate)} × {days} days)</span>
            <span className="font-semibold text-white">{formatCurrency(baseRental)}</span>
          </div>

          {includeDriver && (
            <div className="flex justify-between text-slate-300">
              <span>Driver fee (10,000 × {days} days)</span>
              <span className="font-semibold text-white">{formatCurrency(driverFee)}</span>
            </div>
          )}

          {includeInsurance && (
            <div className="flex justify-between text-slate-300">
              <span>Insurance package</span>
              <span className="font-semibold text-white">{formatCurrency(insuranceFee)}</span>
            </div>
          )}

          <div className="border-t border-slate-700 pt-2 flex justify-between text-sm font-bold text-emerald-400">
            <span>Total Estimated Cost</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>

          <div className="flex justify-between text-slate-300 pt-1">
            <span>Deposit Required Now</span>
            <span className="text-amber-400 font-bold">{formatCurrency(depositAmount)}</span>
          </div>

          <div className="flex justify-between text-slate-400 border-t border-slate-800 pt-1.5 text-[11px]">
            <span>Balance Due at Pickup</span>
            <span>{formatCurrency(balanceAmount)}</span>
          </div>
        </div>

        {/* Proceed to Booking */}
        <Link
          href={`/checkout?${checkoutQuery}`}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-bold text-sm transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 group"
        >
          <span>Continue to Reservation & Deposit</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
        </Link>
      </div>
    </div>
  );
}
