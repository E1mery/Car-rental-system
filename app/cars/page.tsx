"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { VehicleCard } from "@/components/VehicleCard";
import { getVehicles } from "@/lib/store";
import { Vehicle } from "@/lib/types";
import { Search, SlidersHorizontal, Car, Filter, RefreshCw } from "lucide-react";

function CarsList() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialStart = searchParams.get("start") || new Date().toISOString().split("T")[0];
  const initialEnd = searchParams.get("end") || new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0];

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [transmission, setTransmission] = useState("All");
  const [fuelType, setFuelType] = useState("All");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState("recommended");

  useEffect(() => {
    setVehicles(getVehicles());
    const onStoreUpdate = () => setVehicles(getVehicles());
    window.addEventListener("rcrms_store_updated", onStoreUpdate);
    return () => window.removeEventListener("rcrms_store_updated", onStoreUpdate);
  }, []);

  const categories = ["All", "Compact SUV", "Full-Size 4x4", "Luxury Sedan", "Passenger Van"];

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      // Search text
      if (
        searchQuery &&
        !v.make.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !v.model.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !v.registrationNo.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Category filter
      if (selectedCategory !== "All" && v.categoryName !== selectedCategory) {
        return false;
      }

      // Transmission
      if (transmission !== "All" && v.transmission !== transmission) {
        return false;
      }

      // Fuel type
      if (fuelType !== "All" && v.fuelType !== fuelType) {
        return false;
      }

      // Availability
      if (onlyAvailable && v.status !== "AVAILABLE") {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.dailyRate - b.dailyRate;
      if (sortBy === "price-high") return b.dailyRate - a.dailyRate;
      return 0;
    });
  }, [vehicles, searchQuery, selectedCategory, transmission, fuelType, onlyAvailable, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setTransmission("All");
    setFuelType("All");
    setOnlyAvailable(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Fleet & Vehicles in Rwanda
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Browse available SUVs, executive sedans, and 4x4 safari vehicles in Kigali. Zero hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            {/* Left Filter Sidebar */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Filter className="w-4 h-4 text-blue-600" />
                  <span>Filter Fleet</span>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] font-semibold text-slate-400 hover:text-blue-600 transition flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Keyword Search */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Toyota, Prado, plate..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Vehicle Category
                </label>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center justify-between ${
                        selectedCategory === cat
                          ? "bg-blue-50 text-blue-700 font-bold border border-blue-200"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>{cat}</span>
                      {cat === "All" ? (
                        <span className="text-[11px] text-slate-400">{vehicles.length}</span>
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          {vehicles.filter((v) => v.categoryName === cat).length}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transmission */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Transmission
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {["All", "Automatic", "Manual"].map((item) => (
                    <button
                      key={item}
                      onClick={() => setTransmission(item)}
                      className={`py-1.5 text-xs font-medium rounded-lg border text-center transition ${
                        transmission === item
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fuel Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Fuel Type
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {["All", "Petrol", "Diesel"].map((item) => (
                    <button
                      key={item}
                      onClick={() => setFuelType(item)}
                      className={`py-1.5 text-xs font-medium rounded-lg border text-center transition ${
                        fuelType === item
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability checkbox */}
              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={onlyAvailable}
                    onChange={(e) => setOnlyAvailable(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Show only available cars</span>
                </label>
              </div>
            </div>

            {/* Vehicle Grid & Sorting Bar */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-slate-500">
                  Showing <strong className="text-slate-800 font-bold">{filteredVehicles.length}</strong> vehicles found
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Grid */}
              {filteredVehicles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      searchDates={{ start: initialStart, end: initialEnd }}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
                  <Car className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="text-lg font-bold text-slate-800">
                    {vehicles.length === 0 ? "No vehicles currently in fleet" : "No vehicles match your search"}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {vehicles.length === 0
                      ? "Vehicles added by the manager in the Manager Portal will automatically appear here."
                      : "Try loosening your filters or resetting the search query to see other available vehicles."}
                  </p>
                  {vehicles.length > 0 && (
                    <button
                      onClick={handleResetFilters}
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-sm hover:bg-blue-700 transition"
                    >
                      Reset All Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CarsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Loading fleet...</div>}>
      <CarsList />
    </Suspense>
  );
}
