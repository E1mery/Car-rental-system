"use client";

import React, { useState, useEffect } from "react";
import {
  getVehicles,
  saveVehicle,
  updateVehicleStatus,
  deleteVehicle,
  seedStarterVehicles,
} from "@/lib/store";
import { Vehicle, VehicleStatus } from "@/lib/types";
import { formatCurrency, formatDate, getStatusBadgeClass } from "@/lib/utils";
import { QRCodeModal } from "@/components/QRCodeModal";
import {
  Car,
  Plus,
  Search,
  Filter,
  QrCode,
  Edit,
  Trash2,
  Wrench,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
} from "lucide-react";

export default function FleetManagementPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedVehicleForQR, setSelectedVehicleForQR] = useState<Vehicle | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New vehicle form state
  const [newReg, setNewReg] = useState("");
  const [newMake, setNewMake] = useState("Toyota");
  const [newModel, setNewModel] = useState("RAV4");
  const [newYear, setNewYear] = useState(2024);
  const [newColor, setNewColor] = useState("Silver");
  const [newRate, setNewRate] = useState(50000);
  const [newCategory, setNewCategory] = useState("Compact SUV");
  const [newMileage, setNewMileage] = useState(25000);
  const [newImageUrl, setNewImageUrl] = useState(
    "https://images.unsplash.com/photo-1581540222194-0def2dda95b8?auto=format&fit=crop&w=800&q=80"
  );
  const [newFuelType, setNewFuelType] = useState("Petrol");
  const [newSeats, setNewSeats] = useState(5);

  const reloadVehicles = () => {
    setVehicles(getVehicles());
  };

  useEffect(() => {
    reloadVehicles();
    window.addEventListener("rcrms_store_updated", reloadVehicles);
    return () => window.removeEventListener("rcrms_store_updated", reloadVehicles);
  }, []);

  const filtered = vehicles.filter((v) => {
    if (
      searchQuery &&
      !v.make.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !v.model.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !v.registrationNo.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (statusFilter !== "ALL" && v.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const handleOpenQR = (v: Vehicle) => {
    setSelectedVehicleForQR(v);
    setQrModalOpen(true);
  };

  const handleUpdateStatus = (id: string, newStatus: VehicleStatus) => {
    updateVehicleStatus(id, newStatus);
    reloadVehicles();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this vehicle from the fleet?")) {
      deleteVehicle(id);
      reloadVehicles();
    }
  };

  const handleSeedStarterVehicles = () => {
    seedStarterVehicles();
    reloadVehicles();
  };

  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReg.trim()) return;

    const newVehicle: Vehicle = {
      id: `veh-${Date.now()}`,
      registrationNo: newReg.trim().toUpperCase(),
      make: newMake.trim(),
      model: newModel.trim(),
      year: Number(newYear),
      color: newColor.trim(),
      transmission: "Automatic",
      fuelType: newFuelType,
      seats: Number(newSeats),
      dailyRate: Number(newRate),
      currentMileage: Number(newMileage),
      status: "AVAILABLE",
      categoryId: "cat-suv",
      categoryName: newCategory,
      insuranceExpiry: "2027-12-31",
      inspectionExpiry: "2027-12-31",
      lastServiceDate: new Date().toISOString().split("T")[0],
      imageUrl: newImageUrl || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
      description: "Fleet vehicle managed by Kigali Operations.",
      features: ["All-Wheel Drive", "Air Conditioning", "Reverse Camera"],
    };

    saveVehicle(newVehicle);
    reloadVehicles();
    setIsAddModalOpen(false);
    setNewReg("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Fleet & Vehicle Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete vehicle repository, registration plates, mileage tracking, and mobile QR codes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {vehicles.length === 0 && (
            <button
              onClick={handleSeedStarterVehicles}
              className="flex items-center gap-1.5 px-3 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Add Starter Vehicles</span>
            </button>
          )}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Vehicle</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="font-bold text-slate-700 mr-1">Status:</span>
          {["ALL", "AVAILABLE", "RENTED", "RESERVED", "MAINTENANCE"].map((st) => (
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
            placeholder="Search make, model, plate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Vehicle Inventory Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-14 text-center space-y-3">
            <Car className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No Vehicles in Fleet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All demo data was removed. Register your fleet vehicles using the button above.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-1.5 bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Vehicle</span>
              </button>
              <button
                onClick={handleSeedStarterVehicles}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Initialize 3 Sample Cars</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Vehicle Details</th>
                  <th className="py-3 px-4">Plate No</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Daily Rate</th>
                  <th className="py-3 px-4">Odometer</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={vehicle.imageUrl || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=200&q=80"}
                          alt={vehicle.model}
                          className="w-12 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <strong className="font-bold text-slate-900 block">
                            {vehicle.make} {vehicle.model}
                          </strong>
                          <span className="text-[11px] text-slate-400">
                            {vehicle.year} • {vehicle.transmission} • {vehicle.fuelType}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">
                      {vehicle.registrationNo}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {vehicle.categoryName || "SUV"}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={vehicle.status}
                        onChange={(e) => handleUpdateStatus(vehicle.id, e.target.value as VehicleStatus)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-full border focus:outline-none ${
                          vehicle.status === "AVAILABLE"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : vehicle.status === "RENTED"
                            ? "bg-amber-50 text-amber-800 border-amber-300"
                            : vehicle.status === "RESERVED"
                            ? "bg-blue-50 text-blue-800 border-blue-300"
                            : "bg-rose-50 text-rose-800 border-rose-300"
                        }`}
                      >
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="RESERVED">RESERVED</option>
                        <option value="RENTED">RENTED</option>
                        <option value="MAINTENANCE">MAINTENANCE</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 font-black text-slate-900">
                      {formatCurrency(vehicle.dailyRate)}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {vehicle.currentMileage?.toLocaleString() || 0} km
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenQR(vehicle)}
                          title="Generate Vehicle QR"
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(vehicle.id)}
                          title="Delete Vehicle"
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Vehicle Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">Register New Vehicle to Fleet</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVehicle} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Make *</label>
                  <input
                    type="text"
                    required
                    value={newMake}
                    onChange={(e) => setNewMake(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Model *</label>
                  <input
                    type="text"
                    required
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Plate Number (Rwanda) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RAD 123A"
                    value={newReg}
                    onChange={(e) => setNewReg(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold uppercase"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Year</label>
                  <input
                    type="number"
                    value={newYear}
                    onChange={(e) => setNewYear(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                  >
                    <option value="Compact SUV">Compact SUV</option>
                    <option value="Full-Size 4x4">Full-Size 4x4</option>
                    <option value="Luxury Sedan">Luxury Sedan</option>
                    <option value="Passenger Van">Passenger Van</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Daily Rate (RWF) *</label>
                  <input
                    type="number"
                    step="1000"
                    required
                    value={newRate}
                    onChange={(e) => setNewRate(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Current Mileage</label>
                  <input
                    type="number"
                    value={newMileage}
                    onChange={(e) => setNewMileage(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fuel Type</label>
                  <select
                    value={newFuelType}
                    onChange={(e) => setNewFuelType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Seats</label>
                  <input
                    type="number"
                    value={newSeats}
                    onChange={(e) => setNewSeats(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Photo Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium"
                />
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-500/25"
                >
                  Save Vehicle to Fleet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Modal for Vehicle Inspection */}
      <QRCodeModal
        vehicle={selectedVehicleForQR}
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
      />
    </div>
  );
}
