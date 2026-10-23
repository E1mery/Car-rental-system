"use client";

import React, { useState, useEffect } from "react";
import { getCustomers, getBookings } from "@/lib/store";
import { Customer } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  CreditCard,
  FileCheck,
  MapPin,
  Calendar,
  AlertCircle,
  UserCheck,
} from "lucide-react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const reloadCustomers = () => {
    const custs = getCustomers();
    const bookings = getBookings();

    // Attach dynamic rental count and dynamic balance
    const enriched = custs.map((c) => {
      const userBookings = bookings.filter(
        (b) => b.customerId === c.id || (b.customerEmail && b.customerEmail.toLowerCase() === c.email.toLowerCase())
      );
      const balance = userBookings
        .filter((b) => b.status === "CONFIRMED" || b.status === "ACTIVE")
        .reduce((sum, b) => sum + (b.balanceAmount || 0), 0);

      return {
        ...c,
        totalBookings: userBookings.length,
        balance,
      };
    });

    setCustomers(enriched);
  };

  useEffect(() => {
    reloadCustomers();
    window.addEventListener("rcrms_store_updated", reloadCustomers);
    return () => window.removeEventListener("rcrms_store_updated", reloadCustomers);
  }, []);

  const filtered = customers.filter((c) => {
    if (
      searchQuery &&
      !c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !c.email.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !c.phone.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !c.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Customer Directory ({customers.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Registered customer accounts, driving license verification, and reservation history.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customer, phone, license..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {customers.length === 0 ? (
          <div className="py-14 text-center space-y-3">
            <Users className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No Customers Registered Yet</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              All demo accounts were removed. When customers register an account on the Customer Portal (/customer/register), their verified details will be automatically displayed here.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-500">
            No customers match &quot;{searchQuery}&quot;
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Driving License</th>
                  <th className="py-3 px-4">National ID / Passport</th>
                  <th className="py-3 px-4">Address</th>
                  <th className="py-3 px-4">Reservations</th>
                  <th className="py-3 px-4 text-right">Balance Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {c.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong className="font-bold text-slate-900 block text-sm">{c.fullName}</strong>
                          <span className="text-[10px] text-slate-400">Registered: {c.createdAt}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-slate-800 block">{c.phone}</span>
                        <span className="text-slate-400 text-[11px] block">{c.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-blue-600 block">{c.licenseNumber}</span>
                      <span className="text-[10px] text-emerald-600 font-semibold">Verified Driver</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      {c.nationalId || "On file"}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {c.address || "Kigali, Rwanda"}
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold">
                        {c.totalBookings || 0} Bookings
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {c.balance > 0 ? (
                        <span className="font-mono font-black text-rose-600 text-xs">
                          {formatCurrency(c.balance)}
                        </span>
                      ) : (
                        <span className="font-semibold text-emerald-600 text-xs">
                          Settled (0 RWF)
                        </span>
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
