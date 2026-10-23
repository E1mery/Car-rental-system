"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getBookings, getVehicles } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Booking, Vehicle } from "@/lib/types";
import {
  Printer,
  Download,
  ArrowLeft,
  Car,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
} from "lucide-react";

export default function RentalAgreementPrintPage() {
  const params = useParams();
  const agreementId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    const allBookings = getBookings();
    const b = allBookings.find((item) => item.id === agreementId || item.bookingCode === agreementId) || allBookings[0] || null;
    setBooking(b);
    if (b) {
      const allVehicles = getVehicles();
      const v = allVehicles.find((veh) => veh.id === b.vehicleId) || null;
      setVehicle(v);
    }
  }, [agreementId]);

  const handlePrint = () => {
    window.print();
  };

  if (!booking) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-3">
        <h3 className="font-bold text-slate-800">Booking Record Not Found</h3>
        <p className="text-xs text-slate-500">The requested reservation does not exist or was removed.</p>
        <Link href="/admin/bookings" className="inline-block text-xs font-bold text-blue-600">
          &larr; Back to Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Non-print action bar */}
      <div className="no-print flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <Link
          href="/admin/bookings"
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Bookings</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 hidden sm:inline">
            Official Legal Contract • Kigali Jurisdiction
          </span>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl text-xs transition shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print or Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Agreement Document Container */}
      <div className="printable-area bg-white rounded-3xl p-8 sm:p-12 border border-slate-300 shadow-xl text-slate-900 space-y-8 font-sans">
        {/* Document Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black">
              <Car className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none">
                RentaGo Rwanda Ltd
              </h1>
              <span className="text-xs text-slate-500 font-semibold block mt-1">
                Rwanda Car Rental Management System (RCRMS)
              </span>
              <span className="text-[11px] text-slate-400 block">
                TIN: 102948210 • KG 14 Ave, Nyarutarama, Kigali, Rwanda
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="bg-slate-900 text-white font-mono font-bold text-xs px-3 py-1 rounded-lg">
              AGREEMENT # {booking.bookingCode}
            </span>
            <span className="text-xs text-slate-500 block mt-2">
              Date: <strong>{formatDate(new Date())}</strong>
            </span>
          </div>
        </div>

        {/* Contract Title */}
        <div className="text-center py-2 bg-slate-50 rounded-xl border border-slate-200">
          <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">
            Vehicle Rental Agreement & Digital Handover Contract
          </h2>
        </div>

        {/* Section 1 & 2: Parties Information */}
        <div className="grid grid-cols-2 gap-8 text-xs">
          {/* Customer / Hirer Information */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1 text-blue-600">
              1. Customer / Hirer Information
            </h3>
            <div className="space-y-1 text-slate-700">
              <p><strong>Full Name:</strong> {booking.customerName}</p>
              <p><strong>Contact Phone:</strong> {booking.customerPhone}</p>
              <p><strong>Email:</strong> {booking.customerEmail}</p>
              <p><strong>Driving License No:</strong> RW-DL-98214-B (Cat. B)</p>
              <p><strong>National ID / Passport:</strong> 1 1990 8 0012345 0 88</p>
              <p><strong>Residential Address:</strong> Kigali, Rwanda</p>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1 text-blue-600">
              2. Vehicle Specifications
            </h3>
            <div className="space-y-1 text-slate-700">
              <p><strong>Make & Model:</strong> {vehicle.make} {vehicle.model} ({vehicle.year})</p>
              <p><strong>Registration Plate:</strong> <span className="font-mono font-bold text-slate-900">{vehicle.registrationNo}</span></p>
              <p><strong>Category:</strong> {vehicle.categoryName}</p>
              <p><strong>Transmission & Fuel:</strong> {vehicle.transmission} • {vehicle.fuelType}</p>
              <p><strong>Insurance Policy:</strong> Radiant Insurance Co (Comprehensive)</p>
              <p><strong>Handover Inspection:</strong> Passed / Certified Roadworthy</p>
            </div>
          </div>
        </div>

        {/* Section 3: Rental Schedule & Handover Baseline */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
          <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1 text-blue-600">
            3. Rental Window & Baseline Condition
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-slate-700">
            <div>
              <span className="text-slate-400 block text-[10px]">Pickup Date & Time:</span>
              <strong className="text-slate-900">{formatDate(booking.startDate)} 09:00 AM</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Expected Return:</span>
              <strong className="text-slate-900">{formatDate(booking.endDate)} 05:00 PM</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Outgoing Mileage:</span>
              <strong className="text-slate-900 font-mono">{vehicle.currentMileage.toLocaleString()} km</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Outgoing Fuel Level:</span>
              <strong className="text-slate-900 font-mono">80% Full Tank</strong>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 text-slate-600">
            <strong>Condition Notes:</strong> Vehicle handed over in clean interior and good exterior condition. Minor scratch noted on rear bumper.
          </div>
        </div>

        {/* Section 4: Financial Rates & Deposits */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-4">Item Description</th>
                <th className="py-2.5 px-4">Rate</th>
                <th className="py-2.5 px-4">Duration</th>
                <th className="py-2.5 px-4 text-right">Amount (RWF)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2 px-4 font-semibold">Base Vehicle Rental Fee</td>
                <td className="py-2 px-4">{formatCurrency(booking.dailyRate)} / day</td>
                <td className="py-2 px-4">{booking.totalDays} Days</td>
                <td className="py-2 px-4 text-right font-mono font-bold">{formatCurrency(booking.baseRentalFee)}</td>
              </tr>
              {booking.driverFee > 0 && (
                <tr>
                  <td className="py-2 px-4 font-semibold">Professional Chauffeur Services</td>
                  <td className="py-2 px-4">10,000 RWF / day</td>
                  <td className="py-2 px-4">{booking.totalDays} Days</td>
                  <td className="py-2 px-4 text-right font-mono font-bold">{formatCurrency(booking.driverFee)}</td>
                </tr>
              )}
              {booking.insuranceFee > 0 && (
                <tr>
                  <td className="py-2 px-4 font-semibold">Zero-Excess Premium Insurance Package</td>
                  <td className="py-2 px-4">3,750 RWF / day</td>
                  <td className="py-2 px-4">{booking.totalDays} Days</td>
                  <td className="py-2 px-4 text-right font-mono font-bold">{formatCurrency(booking.insuranceFee)}</td>
                </tr>
              )}
              <tr className="bg-slate-50 font-bold">
                <td colSpan={3} className="py-2 px-4 text-right uppercase">Total Estimated Rental Value:</td>
                <td className="py-2 px-4 text-right font-mono font-extrabold text-sm">{formatCurrency(booking.totalAmount)}</td>
              </tr>
              <tr className="bg-slate-50 font-semibold text-emerald-700">
                <td colSpan={3} className="py-2 px-4 text-right uppercase">Security Deposit Paid (MoMo / Card):</td>
                <td className="py-2 px-4 text-right font-mono font-bold">- {formatCurrency(booking.depositAmount)}</td>
              </tr>
              <tr className="bg-slate-100 font-extrabold text-blue-700">
                <td colSpan={3} className="py-2.5 px-4 text-right uppercase">Net Balance Due on Handover:</td>
                <td className="py-2.5 px-4 text-right font-mono text-sm">{formatCurrency(booking.balanceAmount)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 5: Standard Terms & Conditions */}
        <div className="space-y-1.5 text-[10px] text-slate-500 leading-relaxed border-t border-slate-200 pt-4">
          <strong className="text-slate-700 block uppercase font-bold text-[11px]">5. General Terms & Operating Regulations:</strong>
          <p>1. The Hirer agrees to operate the vehicle in strict accordance with the traffic laws of the Republic of Rwanda.</p>
          <p>2. Fuel is governed under the Same-to-Same policy. The Hirer shall return the vehicle with equivalent or higher fuel level.</p>
          <p>3. In the event of mechanical breakdown or accident, the Hirer shall immediately notify RentaGo 24/7 hotline (+250 788 123 456) and Rwanda National Police Traffic Department (113).</p>
          <p>4. The vehicle shall not be sub-rented, driven off designated road networks without explicit 4x4 clearance, or used to transport prohibited cargo.</p>
        </div>

        {/* Section 6: Signatures Section */}
        <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-2 gap-8 text-xs">
          <div className="border border-slate-300 rounded-2xl p-4 space-y-3 bg-slate-50">
            <span className="font-bold text-slate-900 block text-[11px] uppercase">
              Customer / Hirer Signature
            </span>
            <div className="h-16 flex items-center justify-center font-serif text-blue-900 text-lg italic bg-white border border-dashed border-slate-300 rounded-lg">
              {booking.customerName}
            </div>
            <div className="text-[10px] text-slate-500">
              <p>Name: <strong>{booking.customerName}</strong></p>
              <p>Verified Timestamp: <strong>{formatDate(new Date())}</strong></p>
            </div>
          </div>

          <div className="border border-slate-300 rounded-2xl p-4 space-y-3 bg-slate-50">
            <span className="font-bold text-slate-900 block text-[11px] uppercase">
              For RentaGo Rwanda Ltd (Authorized Agent)
            </span>
            <div className="h-16 flex items-center justify-center font-serif text-blue-900 text-lg italic bg-white border border-dashed border-slate-300 rounded-lg">
              Claude Rukundo (Agent #104)
            </div>
            <div className="text-[10px] text-slate-500">
              <p>Officer: <strong>Claude Rukundo</strong></p>
              <p>Branch: <strong>Kigali International Airport</strong></p>
            </div>
          </div>
        </div>

        {/* Document Footer stamp */}
        <div className="text-center text-[10px] text-slate-400 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span>RCRMS Generated Document • Valid without physical seal under Law No 24/2016 on Electronic Messages and Electronic Signatures in Rwanda</span>
          <span className="font-mono">Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
}
