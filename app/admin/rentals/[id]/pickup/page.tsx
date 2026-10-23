"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getBookings, getVehicles, updateBookingStatus, updateVehicleStatus, saveAgreement } from "@/lib/store";
import { SignaturePad } from "@/components/SignaturePad";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Booking, Vehicle, RentalAgreement } from "@/lib/types";
import {
  Key,
  Gauge,
  Fuel,
  CheckCircle2,
  FileText,
  Camera,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  PenTool,
} from "lucide-react";

export default function PickupInspectionPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  // Inspection form states
  const [mileageOut, setMileageOut] = useState<number>(0);
  const [fuelLevel, setFuelLevel] = useState<number>(100);
  const [exteriorCondition, setExteriorCondition] = useState("Good");
  const [interiorCondition, setInteriorCondition] = useState("Good");
  const [existingDamage, setExistingDamage] = useState("No visible damage");
  const [customerSignature, setCustomerSignature] = useState("");
  const [agentSignature, setAgentSignature] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const allBookings = getBookings();
    const b = allBookings.find((item) => item.id === bookingId || item.bookingCode === bookingId) || allBookings[0] || null;
    setBooking(b);
    if (b) {
      const allVehicles = getVehicles();
      const v = allVehicles.find((veh) => veh.id === b.vehicleId) || null;
      setVehicle(v);
      if (v) {
        setMileageOut(v.currentMileage || 0);
      }
    }
  }, [bookingId]);

  const handleSubmitHandover = (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;

    setIsSubmitting(true);

    setTimeout(() => {
      updateBookingStatus(booking.id, "ACTIVE");
      if (vehicle) {
        updateVehicleStatus(vehicle.id, "RENTED");
      }

      const agreement: RentalAgreement = {
        id: `ra-${Date.now()}`,
        rentalCode: `RA-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        bookingId: booking.id,
        customerId: booking.customerId,
        customerName: booking.customerName || "Customer",
        customerLicense: "RW-DL-VERIFIED",
        customerPhone: booking.customerPhone || "+250 788 000 000",
        customerEmail: booking.customerEmail || "",
        vehicleId: booking.vehicleId,
        vehicleName: booking.vehicleName || "Vehicle",
        vehiclePlate: booking.vehiclePlate || "Plate",
        vehicleMileage: mileageOut,
        startDate: booking.startDate,
        endDate: booking.endDate,
        pickupMileage: mileageOut,
        pickupFuelLevel: fuelLevel,
        pickupCondition: `${exteriorCondition} exterior, ${interiorCondition} interior`,
        pickupDamages: existingDamage,
        customerSignature,
        agentSignature,
        baseRentalFee: booking.baseRentalFee,
        driverFee: booking.driverFee,
        insuranceFee: booking.insuranceFee,
        lateFee: 0,
        damageFee: 0,
        extraMileageFee: 0,
        finalTotal: booking.totalAmount,
        depositPaid: booking.depositAmount,
        amountPaid: booking.depositAmount,
        outstandingBalance: booking.balanceAmount,
        status: "ACTIVE",
        createdAt: new Date().toISOString().split("T")[0],
      };

      saveAgreement(agreement);
      setIsSubmitting(false);
      setCompleted(true);
    }, 1000);
  };

  if (!booking) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-3">
        <h3 className="font-bold text-slate-800">Booking Not Found</h3>
        <p className="text-xs text-slate-500">The requested reservation does not exist.</p>
        <Link href="/admin/bookings" className="inline-block text-xs font-bold text-blue-600">
          &larr; Back to Bookings
        </Link>
      </div>
    );
  }

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
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
              Pickup Checklist
            </span>
            <span className="font-mono text-xs font-bold text-slate-500">
              {booking.bookingCode}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Vehicle Handover & Pickup Inspection
          </h1>
          <p className="text-xs text-slate-500">
            Log outgoing mileage, fuel gauge, preexisting condition, and capture dual digital signatures.
          </p>
        </div>
      </div>

      {completed ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-black text-slate-900">
            Vehicle Handover Complete! Keys Dispatched.
          </h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            The rental agreement has been compiled, digitally signed, and archived with starting odometer at{" "}
            <strong>{mileageOut.toLocaleString()} km</strong> and fuel at <strong>{fuelLevel}%</strong>.
          </p>
          <div className="flex items-center justify-center gap-3 pt-4">
            <Link
              href={`/admin/agreements/${booking.id}`}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              <span>Print Signed Rental Agreement</span>
            </Link>
            <Link
              href="/admin/bookings"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
            >
              Return to Pipeline
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmitHandover} className="space-y-6">
          {/* Reservation Summary Strip */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Customer</span>
              <strong className="font-bold text-slate-800 text-sm">{booking.customerName}</strong>
              <span className="text-slate-500 block">{booking.customerPhone}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Assigned Vehicle</span>
              <strong className="font-bold text-slate-800 text-sm">{booking.vehicleName}</strong>
              <span className="font-mono text-blue-600 font-bold block">Plate: {booking.vehiclePlate}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Rental Schedule</span>
              <strong className="font-bold text-slate-800">
                {formatDate(booking.startDate)} &rarr; {formatDate(booking.endDate)}
              </strong>
              <span className="text-slate-500 block">{booking.totalDays} Days ({booking.pickupLocation})</span>
            </div>
          </div>

          {/* Inspection Details Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-sm font-bold text-slate-900">
              <Gauge className="w-4 h-4 text-blue-600" />
              <span>Physical Inspection Record (Before Rental)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Starting Mileage */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-blue-600" />
                  <span>Outgoing Mileage (Odometer in km) *</span>
                </label>
                <input
                  type="number"
                  required
                  value={mileageOut}
                  onChange={(e) => setMileageOut(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Fuel Level */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Fuel className="w-3.5 h-3.5 text-amber-600" />
                  <span>Outgoing Fuel Level: {fuelLevel}%</span>
                </label>
                <div className="flex items-center gap-3 mt-2">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={fuelLevel}
                    onChange={(e) => setFuelLevel(Number(e.target.value))}
                    className="flex-1 accent-blue-600 cursor-pointer"
                  />
                  <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {fuelLevel}%
                  </span>
                </div>
              </div>
            </div>

            {/* Condition Check */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Exterior Condition
                </label>
                <select
                  value={exteriorCondition}
                  onChange={(e) => setExteriorCondition(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="Excellent">Excellent (No marks)</option>
                  <option value="Good">Good (Normal wear)</option>
                  <option value="Fair">Fair (Noticeable blemishes)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Interior Condition
                </label>
                <select
                  value={interiorCondition}
                  onChange={(e) => setInteriorCondition(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="Spotless / Detailed">Spotless / Detailed</option>
                  <option value="Good">Good (Clean)</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>
            </div>

            {/* Existing Scratches or Pre-rental Damage */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Existing Damage Notes & Scratches
              </label>
              <textarea
                rows={2}
                value={existingDamage}
                onChange={(e) => setExistingDamage(e.target.value)}
                placeholder="e.g. Small scratch on rear bumper, minor stone chip on passenger door..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          {/* Digital Signatures Card - Dual Signatures */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-sm font-bold text-slate-900">
              <PenTool className="w-4 h-4 text-blue-600" />
              <span>Digital Signatures on Rental Agreement</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <SignaturePad
                label="Customer Legal Signature"
                defaultName={booking.customerName}
                onSave={setCustomerSignature}
              />
              <SignaturePad
                label="Company Agent Signature"
                defaultName="Claude Rukundo (Agent #104)"
                onSave={setAgentSignature}
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                By signing, both parties acknowledge the vehicle condition, fuel level, and adherence to the Rwanda traffic regulations and rental contract terms.
              </span>
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
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/25 flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Generating Legal Agreement...</span>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>Confirm Handover & Dispatch Keys</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
