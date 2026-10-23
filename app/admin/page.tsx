"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  getVehicles,
  getBookings,
  getPayments,
  getMaintenances,
  calculateDashboardStats,
  seedStarterVehicles,
} from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Car,
  Key,
  Calendar,
  Wrench,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle,
  Clock,
  ArrowRight,
  Plus,
  QrCode,
  DollarSign,
  Fuel,
  Users,
  Sparkles,
} from "lucide-react";
import { QRCodeModal } from "@/components/QRCodeModal";
import { Vehicle, Booking, PaymentRecord } from "@/lib/types";

export default function AdminDashboardPage() {
  const [selectedVehicleForQR, setSelectedVehicleForQR] = useState<Vehicle | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const [stats, setStats] = useState(calculateDashboardStats());
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);

  const loadData = () => {
    setStats(calculateDashboardStats());
    setVehicles(getVehicles());
    setBookings(getBookings());
    setPayments(getPayments());
  };

  useEffect(() => {
    loadData();
    window.addEventListener("rcrms_store_updated", loadData);
    return () => window.removeEventListener("rcrms_store_updated", loadData);
  }, []);

  const openQR = (vehicle: Vehicle) => {
    setSelectedVehicleForQR(vehicle);
    setQrModalOpen(true);
  };

  const handleSeedStarterVehicles = () => {
    seedStarterVehicles();
    loadData();
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Manager Control Suite & Fleet Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time status of fleet vehicles, customer reservations, MoMo revenue, and maintenance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {vehicles.length === 0 && (
            <button
              onClick={handleSeedStarterVehicles}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition shadow-sm"
              title="Populate 3 sample Kigali fleet vehicles to test with"
            >
              <Sparkles className="w-4 h-4" />
              <span>Initialize Starter Fleet</span>
            </button>
          )}

          <Link
            href="/admin/vehicles"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vehicle</span>
          </Link>
          <Link
            href="/admin/bookings"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <Calendar className="w-4 h-4" />
            <span>View Reservations</span>
          </Link>
        </div>
      </div>

      {/* 1. Today's Overview KPI Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Live Fleet & Operations Overview
          </h2>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Real-time Synchronized
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* Available Cars */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold text-slate-600">Available</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Car className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {stats.availableCars}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
              Of {stats.totalCars} total fleet
            </span>
          </div>

          {/* Currently Rented */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm relative overflow-hidden group hover:border-amber-300 transition">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold text-slate-600">Rented</span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Key className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {stats.currentlyRented}
            </div>
            <span className="text-[10px] text-amber-600 font-semibold block mt-1">
              Active on the road
            </span>
          </div>

          {/* Reserved */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm relative overflow-hidden group hover:border-blue-300 transition">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold text-slate-600">Reserved</span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {stats.reserved}
            </div>
            <span className="text-[10px] text-blue-600 font-semibold block mt-1">
              Pending pickup
            </span>
          </div>

          {/* Under Maintenance */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm relative overflow-hidden group hover:border-rose-300 transition">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold text-slate-600">Maintenance</span>
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <Wrench className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {stats.underMaintenance}
            </div>
            <span className="text-[10px] text-rose-600 font-semibold block mt-1">
              In garage / service
            </span>
          </div>

          {/* Total Revenue */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold text-slate-600">Total Revenue</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-lg font-black text-slate-900 truncate">
              {formatCurrency(stats.todayRevenue)}
            </div>
            <span className="text-[10px] text-slate-400 font-semibold block mt-1">
              MoMo & Card collected
            </span>
          </div>

          {/* Customers */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm relative overflow-hidden group hover:border-purple-300 transition">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold text-slate-600">Customers</span>
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {stats.totalCustomers}
            </div>
            <span className="text-[10px] text-purple-600 font-semibold block mt-1">
              Registered drivers
            </span>
          </div>
        </div>
      </div>

      {/* 2. Fleet Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900">Fleet Inventory Status</h3>
            <p className="text-xs text-slate-500">Live operational condition and mileage per vehicle</p>
          </div>
          <Link
            href="/admin/vehicles"
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>Manage All Fleet</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {vehicles.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <Car className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">Fleet Is Empty</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All demo vehicles were cleared. Add your real fleet vehicles or click &apos;Initialize Starter Fleet&apos; above.
            </p>
            <Link
              href="/admin/vehicles"
              className="inline-flex items-center gap-1.5 bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-xl"
            >
              <Plus className="w-4 h-4" />
              <span>Add Vehicle Now</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Vehicle</th>
                  <th className="py-3 px-4">Plate No.</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Daily Rate</th>
                  <th className="py-3 px-4">Current Odometer</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vehicles.slice(0, 5).map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-8 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                          <img
                            src={v.imageUrl || "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=200&q=80"}
                            alt={v.model}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{v.make} {v.model}</span>
                          <span className="text-[10px] text-slate-400">{v.year} • {v.fuelType}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">{v.registrationNo}</td>
                    <td className="py-3 px-4 font-medium text-slate-600">{v.categoryName || "SUV"}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{formatCurrency(v.dailyRate)}/day</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{v.currentMileage?.toLocaleString() || 0} km</td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        v.status === "AVAILABLE" ? "bg-emerald-100 text-emerald-800" :
                        v.status === "RENTED" ? "bg-amber-100 text-amber-800" :
                        v.status === "RESERVED" ? "bg-blue-100 text-blue-800" : "bg-rose-100 text-rose-800"
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openQR(v)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Vehicle QR Code"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 3. Bottom Row: Customer Bookings vs Recent Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bookings (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-black text-slate-900">
              Customer Reservations ({bookings.length})
            </h3>
            <Link href="/admin/bookings" className="text-xs font-bold text-blue-600 hover:underline">
              Manage All Bookings &rarr;
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700">No Reservations Yet</h4>
              <p className="text-xs text-slate-500">
                When customers create accounts and reserve vehicles, their bookings appear here instantly.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 5).map((booking) => (
                <div
                  key={booking.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-blue-700">{booking.bookingCode}</span>
                      <span className="bg-white px-2 py-0.5 rounded text-[10px] font-bold border border-slate-200">
                        {booking.status}
                      </span>
                    </div>
                    <strong className="text-slate-900 block font-bold text-sm">
                      {booking.customerName}
                    </strong>
                    <span className="text-slate-500 text-[11px]">
                      {booking.vehicleName} • {formatDate(booking.startDate)} &rarr; {formatDate(booking.endDate)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-xs">
                      {formatCurrency(booking.totalAmount)}
                    </span>
                    <Link
                      href="/admin/bookings"
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payments (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-black text-slate-900">
              Transactions & MoMo Ledger ({payments.length})
            </h3>
            <Link href="/admin/payments" className="text-xs font-bold text-blue-600 hover:underline">
              Ledger &rarr;
            </Link>
          </div>

          {payments.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <DollarSign className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700">No Payments Recorded Yet</h4>
              <p className="text-xs text-slate-500">
                Customer deposit and rental settlements will be tracked here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {payments.slice(0, 5).map((payment) => (
                <div
                  key={payment.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-800">{payment.reference}</span>
                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                        {payment.provider}
                      </span>
                    </div>
                    <span className="text-slate-500 text-[11px] block mt-0.5">
                      {payment.customerName} • {payment.vehicleName}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-extrabold text-slate-900 block text-xs">
                      {formatCurrency(payment.amount)}
                    </span>
                    <span className="text-[10px] text-slate-400">{payment.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* QR Code Modal for Vehicle Inspection */}
      <QRCodeModal
        vehicle={selectedVehicleForQR}
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
      />
    </div>
  );
}
