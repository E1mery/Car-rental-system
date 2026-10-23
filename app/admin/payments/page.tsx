"use client";

import React, { useState, useEffect } from "react";
import { getPayments, savePayment } from "@/lib/store";
import { PaymentRecord, PaymentMethod } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import {
  CreditCard,
  Plus,
  Search,
  Receipt,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  X,
} from "lucide-react";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  // Form states
  const [customerName, setCustomerName] = useState("");
  const [vehicleName, setVehicleName] = useState("");
  const [amount, setAmount] = useState<number>(50000);
  const [method, setMethod] = useState<PaymentMethod>("MOBILE_MONEY");
  const [provider, setProvider] = useState("MTN MoMo (*182#)");
  const [paymentType, setPaymentType] = useState("DEPOSIT");

  const reloadPayments = () => {
    setPayments(getPayments());
  };

  useEffect(() => {
    reloadPayments();
    window.addEventListener("rcrms_store_updated", reloadPayments);
    return () => window.removeEventListener("rcrms_store_updated", reloadPayments);
  }, []);

  const filtered = payments.filter((p) => {
    if (
      searchQuery &&
      !p.reference.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.vehicleName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !amount) return;

    const newRecord: PaymentRecord = {
      id: `pay-${Date.now()}`,
      reference: `PAY-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: customerName.trim(),
      vehicleName: vehicleName.trim() || "Rental Fleet Vehicle",
      amount: Number(amount),
      paymentMethod: method,
      provider,
      paymentType,
      status: "COMPLETED",
      transactionId: `TX-${Math.floor(10000000 + Math.random() * 90000000)}`,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };

    savePayment(newRecord);
    reloadPayments();
    setIsRecordModalOpen(false);
    setCustomerName("");
    setVehicleName("");
  };

  const totalCollected = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Payments & Financial Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Reconcile Mobile Money (MTN MoMo & Airtel Money), Bank of Kigali transfers, and Card settlements.
          </p>
        </div>

        <button
          onClick={() => setIsRecordModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Record Offline Payment</span>
        </button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Total Revenue Collected</span>
            <div className="text-xl font-black text-slate-900">
              {formatCurrency(totalCollected)}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">{payments.length} verified transactions</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Payment Channels</span>
            <div className="text-base font-black text-slate-900">
              MTN MoMo, Airtel, Cards
            </div>
            <span className="text-[10px] text-slate-400">Instant reconciliation</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Ledger Status</span>
            <div className="text-base font-black text-emerald-600">
              Balanced & Audited
            </div>
            <span className="text-[10px] text-slate-400">Kigali Operations</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reference, customer, car..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {payments.length === 0 ? (
          <div className="py-14 text-center space-y-2">
            <Receipt className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No Transactions Yet</h4>
            <p className="text-xs text-slate-500">
              When customers complete reservations or balance payments, records will appear here.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-500">
            No payments match &quot;{searchQuery}&quot;
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Receipt / Ref</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Vehicle</th>
                  <th className="py-3 px-4">Method & Channel</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">
                      {p.reference}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">{p.customerName}</td>
                    <td className="py-3 px-4 text-slate-700">{p.vehicleName}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">{p.paymentMethod}</span>
                      <span className="text-[10px] text-slate-400">{p.provider}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">
                        {p.paymentType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-black text-slate-900">
                      {formatCurrency(p.amount)}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">{p.createdAt}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
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

      {/* Record Payment Modal */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">Record Payment</h3>
              <button
                onClick={() => setIsRecordModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eric Mugabo"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Vehicle Description</label>
                <input
                  type="text"
                  placeholder="e.g. Toyota RAV4 (RAE 123A)"
                  value={vehicleName}
                  onChange={(e) => setVehicleName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount (RWF) *</label>
                  <input
                    type="number"
                    step="1000"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Type</label>
                  <select
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                  >
                    <option value="DEPOSIT">DEPOSIT</option>
                    <option value="RENTAL_FEE">RENTAL_FEE</option>
                    <option value="BALANCE_SETTLEMENT">BALANCE_SETTLEMENT</option>
                    <option value="DAMAGE_FEE">DAMAGE_FEE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                  >
                    <option value="MOBILE_MONEY">MOBILE_MONEY</option>
                    <option value="CREDIT_CARD">CREDIT_CARD</option>
                    <option value="BANK_TRANSFER">BANK_TRANSFER</option>
                    <option value="CASH">CASH</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Provider</label>
                  <input
                    type="text"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-500/25"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
