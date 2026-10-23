"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/components/AuthContext";
import { getBookings, getAgreements, getPayments, savePayment } from "@/lib/store";
import { Booking, RentalAgreement, PaymentRecord } from "@/lib/types";
import { formatCurrency, formatDate, getStatusBadgeClass } from "@/lib/utils";
import {
  User,
  Clock,
  Car,
  FileText,
  CreditCard,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Download,
  Phone,
  Shield,
  ArrowRight,
  LogOut,
  PlusCircle,
  MapPin,
} from "lucide-react";

export default function CustomerPortalPage() {
  const router = useRouter();
  const { customer, isCustomerAuth, isLoading, logoutCustomer } = useAuth();

  const [activeTab, setActiveTab] = useState<"rentals" | "agreements" | "payments">("rentals");
  const [showPayModal, setShowPayModal] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);
  const [momoPhone, setMomoPhone] = useState("");

  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [myAgreements, setMyAgreements] = useState<RentalAgreement[]>([]);
  const [myPayments, setMyPayments] = useState<PaymentRecord[]>([]);

  // Protect route
  useEffect(() => {
    if (!isLoading && !isCustomerAuth) {
      router.push("/customer/login");
    }
  }, [isLoading, isCustomerAuth, router]);

  // Load customer specific data from store
  useEffect(() => {
    if (customer) {
      setMomoPhone(customer.phone);
      const allBookings = getBookings();
      const userBookings = allBookings.filter(
        (b) =>
          b.customerId === customer.id ||
          (b.customerEmail && b.customerEmail.toLowerCase() === customer.email.toLowerCase())
      );
      setMyBookings(userBookings);

      const allAgreements = getAgreements();
      const userAgreements = allAgreements.filter(
        (a) =>
          a.customerId === customer.id ||
          (a.customerEmail && a.customerEmail.toLowerCase() === customer.email.toLowerCase())
      );
      setMyAgreements(userAgreements);

      const allPayments = getPayments();
      const userPayments = allPayments.filter(
        (p) =>
          p.customerName.toLowerCase() === customer.fullName.toLowerCase() ||
          userBookings.some((b) => b.customerName === p.customerName)
      );
      setMyPayments(userPayments);
    }
  }, [customer]);

  if (isLoading || !customer) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-500 font-semibold">Loading your customer account...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate user's actual outstanding balance
  const outstandingBalance = myBookings
    .filter((b) => b.status === "CONFIRMED" || b.status === "ACTIVE")
    .reduce((sum, b) => sum + (b.balanceAmount || 0), 0);

  const handleSettleBalance = (e: React.FormEvent) => {
    e.preventDefault();
    setPaySuccess(true);

    const payment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      reference: `PAY-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: customer.fullName,
      vehicleName: myBookings[0]?.vehicleName || "Rental Settlement",
      amount: outstandingBalance,
      paymentMethod: "MOBILE_MONEY",
      provider: "MTN MoMo (*182#)",
      paymentType: "SETTLEMENT",
      status: "COMPLETED",
      transactionId: `TX-MOMO-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    savePayment(payment);

    setTimeout(() => {
      setShowPayModal(false);
      setPaySuccess(false);
      // Refresh local payments
      setMyPayments(getPayments().filter((p) => p.customerName.toLowerCase() === customer.fullName.toLowerCase()));
    }, 1800);
  };

  const handleLogout = () => {
    logoutCustomer();
    router.push("/");
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Customer Header Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                {customer.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-slate-900">{customer.fullName}</h1>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                    Verified Driver
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {customer.email} • License: <span className="font-semibold text-slate-700">{customer.licenseNumber}</span>
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-2">
                  <span>Phone: <strong className="text-slate-800">{customer.phone}</strong></span>
                  {customer.nationalId && (
                    <>
                      <span>•</span>
                      <span>ID: <strong className="text-slate-800">{customer.nationalId}</strong></span>
                    </>
                  )}
                  <span>•</span>
                  <span>Total Rentals: <strong>{myBookings.length}</strong></span>
                </div>
              </div>
            </div>

            {/* Actions & Balance Banner */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 px-5 flex items-center justify-between gap-6">
                <div>
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                    Outstanding Balance
                  </span>
                  <span className="text-xl font-black text-amber-900">
                    {formatCurrency(outstandingBalance)}
                  </span>
                </div>
                {outstandingBalance > 0 ? (
                  <button
                    onClick={() => setShowPayModal(true)}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl transition shadow-sm"
                  >
                    Pay via MoMo
                  </button>
                ) : (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200">
                    All Paid
                  </span>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-slate-200 mb-6 pb-2">
            <div className="flex items-center gap-2 text-xs font-bold">
              <button
                onClick={() => setActiveTab("rentals")}
                className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
                  activeTab === "rentals"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Car className="w-4 h-4" />
                <span>My Bookings ({myBookings.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("agreements")}
                className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
                  activeTab === "agreements"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Agreements ({myAgreements.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("payments")}
                className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
                  activeTab === "payments"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Payments & Receipts ({myPayments.length})</span>
              </button>
            </div>

            <Link
              href="/cars"
              className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-sm shadow-emerald-600/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Book Another Car</span>
            </Link>
          </div>

          {/* TAB 1: RENTALS & BOOKINGS */}
          {activeTab === "rentals" && (
            <div className="space-y-4">
              {myBookings.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl mx-auto flex items-center justify-center">
                    <Car className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">No Reservations Yet</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      You haven&apos;t booked any cars yet. Explore our Kigali fleet and reserve your preferred vehicle in 2 minutes.
                    </p>
                  </div>
                  <Link
                    href="/cars"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-md shadow-blue-500/20"
                  >
                    <span>Browse Fleet & Book a Car</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                myBookings.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                        <Car className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-blue-600">
                            {b.bookingCode}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getStatusBadgeClass(b.status)}`}>
                            {b.status}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mt-0.5">
                          {b.vehicleName || "Vehicle Reservation"}
                        </h4>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1.5">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {formatDate(b.startDate)} &rarr; {formatDate(b.endDate)} ({b.totalDays} days)
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {b.pickupLocation}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 block">Total Rental</span>
                        <span className="font-extrabold text-sm text-slate-900">
                          {formatCurrency(b.totalAmount)}
                        </span>
                        <span className="text-[10px] text-emerald-600 block">
                          Deposit: {formatCurrency(b.depositAmount)} (Paid)
                        </span>
                      </div>
                      <Link
                        href={`/booking-confirmation?code=${b.bookingCode}&name=${encodeURIComponent(
                          customer.fullName
                        )}&vehicle=${encodeURIComponent(b.vehicleName || "Car")}&total=${b.totalAmount}&deposit=${b.depositAmount}&balance=${b.balanceAmount}`}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2 rounded-xl transition"
                      >
                        View Voucher
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: AGREEMENTS */}
          {activeTab === "agreements" && (
            <div className="space-y-4">
              {myAgreements.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-2">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                  <h4 className="font-bold text-slate-800 text-sm">No Digital Agreements Yet</h4>
                  <p className="text-xs text-slate-500">
                    Rental agreements are automatically created when you pick up your reserved vehicle at our Kigali depot.
                  </p>
                </div>
              ) : (
                myAgreements.map((a) => (
                  <div
                    key={a.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between"
                  >
                    <div>
                      <span className="font-mono text-xs font-bold text-emerald-600">{a.rentalCode}</span>
                      <h4 className="font-bold text-slate-900 text-sm mt-0.5">{a.vehicleName} ({a.vehiclePlate})</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Contract Date: {formatDate(a.startDate)} to {formatDate(a.endDate)}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
                      Digitally Signed
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: PAYMENTS */}
          {activeTab === "payments" && (
            <div className="space-y-4">
              {myPayments.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-2">
                  <CreditCard className="w-10 h-10 text-slate-300 mx-auto" />
                  <h4 className="font-bold text-slate-800 text-sm">No Payments Recorded</h4>
                  <p className="text-xs text-slate-500">
                    All Mobile Money and card transaction receipts will be logged here.
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Reference</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Method & Provider</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {myPayments.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/60 transition">
                          <td className="py-3 px-4 font-mono font-bold text-blue-600">{p.reference}</td>
                          <td className="py-3 px-4 font-semibold text-slate-800">{p.paymentType}</td>
                          <td className="py-3 px-4 text-slate-600">{p.provider || p.paymentMethod}</td>
                          <td className="py-3 px-4 font-black text-slate-900">{formatCurrency(p.amount)}</td>
                          <td className="py-3 px-4 text-slate-500">{p.createdAt}</td>
                          <td className="py-3 px-4">
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Settle Balance Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-black text-slate-900">Settle Outstanding Balance</h3>
            <p className="text-xs text-slate-500">
              Complete your balance settlement instantly using MTN MoMo or Airtel Money.
            </p>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex justify-between items-center">
              <span className="text-xs font-bold text-amber-800">Amount Due:</span>
              <span className="text-xl font-black text-amber-900">{formatCurrency(outstandingBalance)}</span>
            </div>

            <form onSubmit={handleSettleBalance} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Money Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={momoPhone}
                  onChange={(e) => setMomoPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {paySuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Payment approved! USSD push prompt sent to phone.</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-xs text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={paySuccess}
                  className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-md shadow-amber-500/25 disabled:opacity-50"
                >
                  Confirm MoMo (*182#)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
