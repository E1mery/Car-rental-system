"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getBookings, getVehicles, updateBookingStatus, updateVehicleStatus, saveVehicle, savePayment } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Booking, Vehicle, PaymentRecord } from "@/lib/types";
import {
  RotateCcw,
  Gauge,
  Fuel,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  FileText,
  ArrowLeft,
  Receipt,
  ShieldAlert,
} from "lucide-react";

export default function VehicleReturnPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  // Return inspection states
  const [returnMileage, setReturnMileage] = useState<number>(0);
  const [returnFuelLevel, setReturnFuelLevel] = useState<number>(100);
  const [vehicleCondition, setVehicleCondition] = useState("Good");
  const [newDamageNotes, setNewDamageNotes] = useState("Clean return, no new damages");
  const [damageFee, setDamageFee] = useState<number>(0);
  const [lateFee, setLateFee] = useState<number>(0);
  const [cleaningFee, setCleaningFee] = useState<number>(0);

  const [settled, setSettled] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const allBookings = getBookings();
    const b = allBookings.find((item) => item.id === bookingId || item.bookingCode === bookingId) || allBookings[0] || null;
    setBooking(b);
    if (b) {
      const allVehicles = getVehicles();
      const v = allVehicles.find((veh) => veh.id === b.vehicleId) || null;
      setVehicle(v);
      if (v) {
        setReturnMileage((v.currentMileage || 0) + 350);
      }
    }
  }, [bookingId]);

  if (!booking) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-3">
        <h3 className="font-bold text-slate-800">Booking Record Not Found</h3>
        <p className="text-xs text-slate-500">The requested reservation does not exist.</p>
        <Link href="/admin/bookings" className="inline-block text-xs font-bold text-blue-600">
          &larr; Back to Bookings
        </Link>
      </div>
    );
  }

  const initialDeposit = booking.depositAmount || 0;
  const initialRentalCost = booking.baseRentalFee || 0;
  const initialPickupMileage = vehicle?.currentMileage || 0;

  const totalRentalCost = initialRentalCost;
  const totalAdditionalFees = lateFee + damageFee + cleaningFee;
  const finalAmount = totalRentalCost + totalAdditionalFees;
  const remainingBalanceToPay = finalAmount - initialDeposit;
  const netBalance = remainingBalanceToPay;

  const handleProcessReturn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      updateBookingStatus(booking.id, "COMPLETED");
      if (vehicle) {
        saveVehicle({
          ...vehicle,
          status: "AVAILABLE",
          currentMileage: returnMileage,
        });
      }

      if (netBalance > 0) {
        const payment: PaymentRecord = {
          id: `pay-${Date.now()}`,
          reference: `PAY-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          customerName: booking.customerName || "Customer",
          vehicleName: booking.vehicleName || "Vehicle",
          amount: netBalance,
          paymentMethod: "MOBILE_MONEY",
          provider: "MTN MoMo (*182#)",
          paymentType: "SETTLEMENT",
          status: "COMPLETED",
          transactionId: `TX-${Math.floor(10000000 + Math.random() * 90000000)}`,
          createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
        };
        savePayment(payment);
      }

      setIsProcessing(false);
      setSettled(true);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href="/admin/bookings"
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Bookings</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300">
              Return & Settlement
            </span>
            <span className="font-mono text-xs font-bold text-slate-500">
              {booking.bookingCode}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Vehicle Check-in & Final Settlement
          </h1>
          <p className="text-xs text-slate-500">
            Assess return mileage, fuel level, evaluate damages, and calculate automated settlement amount.
          </p>
        </div>
      </div>

      {settled ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">
              Check-in Successful
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              Vehicle Successfully Returned & Settled
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Vehicle status updated to <strong className="text-emerald-600">AVAILABLE</strong> in the Kigali fleet repository.
            </p>
          </div>

          {/* Final Receipt Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 text-left font-mono text-xs space-y-2 max-w-md mx-auto shadow-inner">
            <div className="flex justify-between text-slate-300 border-b border-slate-800 pb-2">
              <span>Rental cost</span>
              <span>{formatCurrency(totalRentalCost)}</span>
            </div>
            {lateFee > 0 && (
              <div className="flex justify-between text-amber-300">
                <span>Late fee</span>
                <span>{formatCurrency(lateFee)}</span>
              </div>
            )}
            {damageFee > 0 && (
              <div className="flex justify-between text-rose-300">
                <span>Damage fee</span>
                <span>{formatCurrency(damageFee)}</span>
              </div>
            )}
            <div className="border-t border-slate-700 pt-2 flex justify-between font-bold text-sm text-white">
              <span>Final amount</span>
              <span>{formatCurrency(finalAmount)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Deposit deducted</span>
              <span>- {formatCurrency(initialDeposit)}</span>
            </div>
            <div className="border-t border-slate-800 pt-2 flex justify-between font-extrabold text-emerald-400 text-base">
              <span>{remainingBalanceToPay >= 0 ? "Net Amount Due" : "Deposit Refund"}</span>
              <span>{formatCurrency(Math.abs(remainingBalanceToPay))}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-3">
            <Link
              href="/admin/payments"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5"
            >
              <Receipt className="w-4 h-4" />
              <span>Record Settlement Payment</span>
            </Link>
            <Link
              href="/admin/bookings"
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
            >
              Back to Bookings
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleProcessReturn} className="space-y-6">
          {/* Top Info Header */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Customer</span>
              <strong className="font-bold text-slate-800 text-sm">{booking.customerName}</strong>
              <span className="text-slate-500 block">{booking.customerPhone}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Returning Vehicle</span>
              <strong className="font-bold text-slate-800 text-sm">{booking.vehicleName}</strong>
              <span className="font-mono text-blue-600 font-bold block">Plate: {booking.vehiclePlate}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Outgoing Baseline</span>
              <strong className="font-bold text-slate-800">
                Mileage: {initialPickupMileage.toLocaleString()} km
              </strong>
              <span className="text-slate-500 block">Initial Deposit: {formatCurrency(initialDeposit)}</span>
            </div>
          </div>

          {/* Return Condition & Damage Assessment */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-sm font-bold text-slate-900">
              <Gauge className="w-4 h-4 text-blue-600" />
              <span>Physical Return Inspection Checklist</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Return Mileage */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-blue-600" />
                  <span>Return Odometer (km) *</span>
                </label>
                <input
                  type="number"
                  required
                  value={returnMileage}
                  onChange={(e) => setReturnMileage(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-[11px] text-slate-400 block mt-1">
                  Trip distance: {(returnMileage - initialPickupMileage).toLocaleString()} km driven
                </span>
              </div>

              {/* Return Fuel */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Fuel className="w-3.5 h-3.5 text-amber-600" />
                  <span>Return Fuel Level: {returnFuelLevel}%</span>
                </label>
                <div className="flex items-center gap-3 mt-2">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={returnFuelLevel}
                    onChange={(e) => setReturnFuelLevel(Number(e.target.value))}
                    className="flex-1 accent-blue-600 cursor-pointer"
                  />
                  <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {returnFuelLevel}%
                  </span>
                </div>
              </div>
            </div>

            {/* Condition Rating */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                General Return Condition
              </label>
              <select
                value={vehicleCondition}
                onChange={(e) => setVehicleCondition(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
              >
                <option value="Good">Good (Satisfactory return)</option>
                <option value="Minor Damage">Minor Scrapes / Dents Reported</option>
                <option value="Severe Damage">Major Damage / Collision Reported</option>
                <option value="Excessive Dirt">Requires Interior Steam Detailing</option>
              </select>
            </div>

            {/* New Damage Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                New Damages Assessment
              </label>
              <textarea
                rows={2}
                value={newDamageNotes}
                onChange={(e) => setNewDamageNotes(e.target.value)}
                placeholder="Log any new scratches, rim scuffs, or cracked lamps..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          {/* Automated Settlement Calculator - Section 9 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-sm font-bold text-slate-900">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Automated Settlement Calculation (RWF)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Late Return Fee</label>
                <input
                  type="number"
                  value={lateFee}
                  onChange={(e) => setLateFee(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Damage Charges</label>
                <input
                  type="number"
                  value={damageFee}
                  onChange={(e) => setDamageFee(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Special Cleaning Fee</label>
                <input
                  type="number"
                  value={cleaningFee}
                  onChange={(e) => setCleaningFee(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            {/* Formula display matching user prompt */}
            <div className="bg-slate-900 text-white rounded-2xl p-4 font-mono text-xs space-y-2 mt-4 shadow-inner">
              <div className="flex justify-between text-slate-300">
                <span>Rental cost</span>
                <span className="font-semibold text-white">{formatCurrency(totalRentalCost)}</span>
              </div>
              <div className="flex justify-between text-amber-300">
                <span>Late fee</span>
                <span>{formatCurrency(lateFee)}</span>
              </div>
              <div className="flex justify-between text-rose-300">
                <span>Damage</span>
                <span>{formatCurrency(damageFee)}</span>
              </div>
              {cleaningFee > 0 && (
                <div className="flex justify-between text-slate-300">
                  <span>Cleaning</span>
                  <span>{formatCurrency(cleaningFee)}</span>
                </div>
              )}
              <div className="border-t border-slate-700 pt-2 flex justify-between font-bold text-sm text-white">
                <span>Final amount</span>
                <span>{formatCurrency(finalAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Deposit paid</span>
                <span>- {formatCurrency(initialDeposit)}</span>
              </div>
              <div className="border-t border-slate-800 pt-2 flex justify-between font-extrabold text-emerald-400 text-base">
                <span>{remainingBalanceToPay >= 0 ? "Outstanding to Collect" : "Deposit Refund Due"}</span>
                <span>{formatCurrency(Math.abs(remainingBalanceToPay))}</span>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3">
            <Link
              href="/admin/bookings"
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-500/25 flex items-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Finalizing Settlement...</span>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>Finalize Return & Generate Settlement Receipt</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
