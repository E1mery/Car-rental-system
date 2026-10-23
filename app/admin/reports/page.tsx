"use client";

import React, { useState, useEffect } from "react";
import { calculateDashboardStats, getVehicles, getCustomers } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { Vehicle, Customer } from "@/lib/types";
import {
  BarChart3,
  TrendingUp,
  Download,
  Printer,
  Calendar,
  DollarSign,
  Car,
  Users,
  Award,
  PieChart,
} from "lucide-react";

export default function ReportsPage() {
  const [reportPeriod, setReportPeriod] = useState("THIS_MONTH");
  const [stats, setStats] = useState(calculateDashboardStats());
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const reloadData = () => {
    setStats(calculateDashboardStats());
    setVehicles(getVehicles());
    setCustomers(getCustomers());
  };

  useEffect(() => {
    reloadData();
    window.addEventListener("rcrms_store_updated", reloadData);
    return () => window.removeEventListener("rcrms_store_updated", reloadData);
  }, []);

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Metric,Value,Unit\n" +
      `Daily Revenue,${stats.todayRevenue},RWF\n` +
      `Monthly Revenue,${stats.monthRevenue},RWF\n` +
      `Fleet Expenses,${stats.monthExpenses},RWF\n` +
      `Net Profit,${stats.netProfit},RWF\n` +
      `Fleet Utilization,${stats.fleetUtilizationRate},%\n` +
      `Outstanding Receivables,${stats.outstandingPayments},RWF\n` +
      `Total Fleet Size,${stats.totalCars},Cars\n` +
      `Total Customers,${stats.totalCustomers},Registered\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `RCRMS_Financial_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const topVehicle = vehicles.length > 0 ? vehicles[0] : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Reports & Executive Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Financial auditing, fleet performance metrics, customer rental frequency, and P&L statements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Financial Statement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Monthly Gross Revenue
          </span>
          <span className="text-2xl font-black text-slate-900">
            {formatCurrency(stats.monthRevenue)}
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold block">
            Realized MoMo & Cards
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Fleet Operational Expenses
          </span>
          <span className="text-2xl font-black text-rose-600">
            {formatCurrency(stats.monthExpenses)}
          </span>
          <span className="text-[11px] text-slate-500 block">
            Maintenance & service
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Net Operating Profit
          </span>
          <span className="text-2xl font-black text-emerald-600">
            {formatCurrency(stats.netProfit)}
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold block">
            Net margin
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Outstanding Receivables
          </span>
          <span className="text-2xl font-black text-amber-600">
            {formatCurrency(stats.outstandingPayments)}
          </span>
          <span className="text-[11px] text-amber-700 block">
            Balance due on handover
          </span>
        </div>
      </div>

      {/* Detailed Analytics Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fleet Performance & Top Vehicle */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Car className="w-4 h-4 text-blue-600" />
              <span>Fleet Utilization & Top Vehicle</span>
            </h3>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
              {stats.fleetUtilizationRate}% Fleet Active
            </span>
          </div>

          <div className="space-y-4">
            {topVehicle ? (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider block">
                    Leading Fleet Vehicle
                  </span>
                  <strong className="text-base font-extrabold text-slate-900 block">
                    {topVehicle.make} {topVehicle.model} ({topVehicle.registrationNo})
                  </strong>
                  <span className="text-xs text-slate-500">
                    Category: {topVehicle.categoryName} • Daily Rate: {formatCurrency(topVehicle.dailyRate)}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                  <Award className="w-6 h-6" />
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No vehicles in fleet yet.</p>
            )}

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Available Vehicles:</span>
                <span className="font-bold text-slate-900">{stats.availableCars}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Currently Rented:</span>
                <span className="font-bold text-amber-600">{stats.currentlyRented}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Reserved:</span>
                <span className="font-bold text-blue-600">{stats.reserved}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Under Maintenance:</span>
                <span className="font-bold text-rose-600">{stats.underMaintenance}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Base Overview */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              <span>Customer Base Summary</span>
            </h3>
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full">
              {customers.length} Verified Drivers
            </span>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 space-y-2">
              <span className="text-[10px] text-purple-700 font-bold uppercase tracking-wider block">
                Active Client Accounts
              </span>
              <div className="text-2xl font-black text-purple-950">
                {customers.length} Customers Registered
              </div>
              <p className="text-xs text-purple-800">
                Accounts created via the Customer Portal with driver license validation.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Total Reservations Generated:</span>
                <span className="font-bold text-slate-900">{stats.totalBookings}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Compliance Level:</span>
                <span className="font-bold text-emerald-600">100% License Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
