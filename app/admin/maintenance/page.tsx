"use client";

import React, { useState, useEffect } from "react";
import { getMaintenances, saveMaintenance, getVehicles } from "@/lib/store";
import { MaintenanceRecord, Vehicle } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Wrench,
  AlertTriangle,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Car,
  DollarSign,
  ShieldCheck,
  X,
} from "lucide-react";

export default function MaintenancePage() {
  const [maintenances, setMaintenances] = useState<MaintenanceRecord[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Form states
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [serviceType, setServiceType] = useState("OIL_CHANGE");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState(45000);
  const [vendor, setVendor] = useState("Toyota Rwanda Service Center, Gikondo");
  const [mileage, setMileage] = useState(30000);

  const reloadData = () => {
    setMaintenances(getMaintenances());
    const vehs = getVehicles();
    setVehicles(vehs);
    if (vehs.length > 0 && !selectedVehicleId) {
      setSelectedVehicleId(vehs[0].id);
    }
  };

  useEffect(() => {
    reloadData();
    window.addEventListener("rcrms_store_updated", reloadData);
    return () => window.removeEventListener("rcrms_store_updated", reloadData);
  }, []);

  const filtered = maintenances.filter((m) => {
    if (
      searchQuery &&
      !m.vehiclePlate?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !m.vehicleName?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !m.serviceType.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const v = vehicles.find((veh) => veh.id === selectedVehicleId) || vehicles[0];

    const newRecord: MaintenanceRecord = {
      id: `maint-${Date.now()}`,
      vehicleId: v ? v.id : "veh-1",
      vehicleName: v ? `${v.make} ${v.model}` : "Fleet Vehicle",
      vehiclePlate: v ? v.registrationNo : "RAD 123A",
      serviceType,
      description: description || `${serviceType} scheduled service`,
      serviceCost: Number(cost),
      serviceMileage: Number(mileage),
      serviceDate: new Date().toISOString().split("T")[0],
      nextDueMileage: Number(mileage) + 5000,
      status: "SCHEDULED",
      vendor,
    };

    saveMaintenance(newRecord);
    reloadData();
    setIsScheduleModalOpen(false);
    setDescription("");
  };

  const totalCost = maintenances.reduce((sum, m) => sum + (m.serviceCost || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Fleet Maintenance & Service ({maintenances.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Preventative maintenance tracking, garage work orders, inspection schedules, and repair expenses.
          </p>
        </div>

        <button
          onClick={() => setIsScheduleModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Service Work</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Service Records</span>
            <div className="text-xl font-black text-slate-900">{maintenances.length} Tickets</div>
            <span className="text-[10px] text-slate-400">Total fleet servicing</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Total Maintenance Expenses</span>
            <div className="text-xl font-black text-rose-700">{formatCurrency(totalCost)}</div>
            <span className="text-[10px] text-slate-400">Garage & repair costs</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Fleet Safety Health</span>
            <div className="text-base font-black text-emerald-600">Roadworthy Certified</div>
            <span className="text-[10px] text-slate-400">Rwanda National Police compliant</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search plate, service type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Maintenance Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {maintenances.length === 0 ? (
          <div className="py-14 text-center space-y-2">
            <Wrench className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No Maintenance Records Yet</h4>
            <p className="text-xs text-slate-500">
              Scheduled vehicle oil changes, tire rotations, and repairs will be tracked here.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-500">
            No maintenance records match &quot;{searchQuery}&quot;
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Vehicle</th>
                  <th className="py-3 px-4">Service Type</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Cost</th>
                  <th className="py-3 px-4">Service Mileage</th>
                  <th className="py-3 px-4">Vendor</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <strong className="font-bold text-slate-900 block">{m.vehicleName}</strong>
                      <span className="font-mono text-blue-600 text-[11px]">{m.vehiclePlate}</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">{m.serviceType}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{m.description}</td>
                    <td className="py-3 px-4 font-black text-slate-900">{formatCurrency(m.serviceCost)}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{m.serviceMileage?.toLocaleString() || 0} km</td>
                    <td className="py-3 px-4 text-slate-500">{m.vendor || "Kigali Service Depot"}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Schedule Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">Schedule Service</h3>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSchedule} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Vehicle *</label>
                {vehicles.length === 0 ? (
                  <p className="text-rose-600 text-xs font-medium">Please add vehicles to the fleet first.</p>
                ) : (
                  <select
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                  >
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.make} {v.model} ({v.registrationNo})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Service Type</label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                >
                  <option value="OIL_CHANGE">OIL_CHANGE</option>
                  <option value="BRAKE_SERVICE">BRAKE_SERVICE</option>
                  <option value="TIRE_REPLACEMENT">TIRE_REPLACEMENT</option>
                  <option value="ENGINE_SERVICE">ENGINE_SERVICE</option>
                  <option value="INSPECTION">INSPECTION</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Work Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Brake pad change and fluid flush"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cost (RWF)</label>
                  <input
                    type="number"
                    step="1000"
                    value={cost}
                    onChange={(e) => setCost(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Current Mileage</label>
                  <input
                    type="number"
                    value={mileage}
                    onChange={(e) => setMileage(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Service Vendor</label>
                <input
                  type="text"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={vehicles.length === 0}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-500/25 disabled:opacity-50"
                >
                  Schedule Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
