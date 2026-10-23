"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getBookings, updateBookingStatus } from "@/lib/store";
import { Booking, BookingStatus } from "@/lib/types";
import { formatCurrency, formatDate, getStatusBadgeClass } from "@/lib/utils";
import {
  CalendarCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Key,
  RotateCcw,
  FileText,
  AlertCircle,
  Plus,
  Calendar,
} from "lucide-react";

export default function BookingsManagementPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const reloadBookings = () => {
    setBookings(getBookings());
  };

  useEffect(() => {
    reloadBookings();
    window.addEventListener("rcrms_store_updated", reloadBookings);
    return () => window.removeEventListener("rcrms_store_updated", reloadBookings);
  }, []);

  const filtered = bookings.filter((b) => {
    if (
      searchQuery &&
      !b.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !b.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !b.vehicleName?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !b.vehiclePlate?.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (statusFilter !== "ALL" && b.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const handleStatusChange = (id: string, newStatus: BookingStatus) => {
    updateBookingStatus(id, newStatus);
    reloadBookings();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Bookings & Rental Pipeline ({bookings.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track customer reservations, dispatch pickups, and execute return condition settlements.
          </p>
        </div>

        <Link
          href="/cars"
          className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm self-start"
        >
          <Plus className="w-4 h-4" />
          <span>New Reservation</span>
        </Link>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          {["ALL", "PENDING", "CONFIRMED", "ACTIVE", "COMPLETED", "CANCELLED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                statusFilter === st
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search code, customer, plate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {bookings.length === 0 ? (
          <div className="py-14 text-center space-y-3">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No Reservations Yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All demo bookings were cleared. When customers reserve vehicles through the Customer Portal, their bookings will appear here.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-500">
            No bookings found matching &quot;{searchQuery}&quot;
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Booking Code</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Reserved Vehicle</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Deposit / Balance</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">
                      {booking.bookingCode}
                    </td>
                    <td className="py-3 px-4">
                      <strong className="font-bold text-slate-900 block">{booking.customerName}</strong>
                      <span className="text-[10px] text-slate-400">{booking.customerPhone}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">{booking.vehicleName}</span>
                      <span className="text-[10px] font-mono text-slate-400">{booking.vehiclePlate}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span className="font-medium block">{formatDate(booking.startDate)} &rarr;</span>
                      <span className="text-[10px] text-slate-400">{formatDate(booking.endDate)} ({booking.totalDays} days)</span>
                    </td>
                    <td className="py-3 px-4 font-extrabold text-slate-900">
                      {formatCurrency(booking.totalAmount)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-bold text-emerald-600 block">
                          Deposit: {formatCurrency(booking.depositAmount)}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          Balance: {formatCurrency(booking.balanceAmount)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value as BookingStatus)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-full border uppercase focus:outline-none ${getStatusBadgeClass(booking.status)}`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {booking.status === "CONFIRMED" && (
                        <Link
                          href={`/admin/rentals/${booking.id}/pickup`}
                          className="inline-block px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[11px]"
                        >
                          Pickup &rarr;
                        </Link>
                      )}
                      {booking.status === "ACTIVE" && (
                        <Link
                          href={`/admin/rentals/${booking.id}/return`}
                          className="inline-block px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px]"
                        >
                          Return &rarr;
                        </Link>
                      )}
                      {(booking.status === "COMPLETED" || booking.status === "CANCELLED" || booking.status === "PENDING") && (
                        <span className="text-slate-400 text-[11px] font-medium">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
