import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, Fuel, Gauge, Sparkles, CheckCircle2 } from "lucide-react";
import { Vehicle } from "@/lib/types";
import { formatCurrency, getStatusBadgeClass } from "@/lib/utils";

interface VehicleCardProps {
  vehicle: Vehicle;
  searchDates?: { start?: string; end?: string };
}

export function VehicleCard({ vehicle, searchDates }: VehicleCardProps) {
  const isAvailable = vehicle.status === "AVAILABLE";

  const bookingHref = `/cars/${vehicle.id}${
    searchDates?.start && searchDates?.end
      ? `?start=${searchDates.start}&end=${searchDates.end}`
      : ""
  }`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group hover:border-blue-200">
      {/* Image Container */}
      <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
        <img
          src={vehicle.imageUrl || "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80"}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border backdrop-blur-md shadow-sm ${getStatusBadgeClass(
              vehicle.status
            )}`}
          >
            {vehicle.status === "AVAILABLE" && "🟢 Available"}
            {vehicle.status === "RESERVED" && "🔵 Reserved"}
            {vehicle.status === "RENTED" && "🟠 Currently Rented"}
            {vehicle.status === "MAINTENANCE" && "🔴 In Maintenance"}
            {vehicle.status === "UNAVAILABLE" && "⚫ Unavailable"}
          </span>
        </div>

        {/* Category Pill */}
        <div className="absolute top-3 right-3">
          <span className="text-[11px] font-bold bg-slate-900/80 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
            {vehicle.categoryName || "Vehicle"}
          </span>
        </div>

        {/* Plate tag */}
        <div className="absolute bottom-2 left-3 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-mono font-bold text-slate-800 shadow-sm border border-slate-300">
          {vehicle.registrationNo}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition leading-snug">
                {vehicle.make} {vehicle.model}
              </h3>
              <span className="text-xs text-slate-500 font-medium">{vehicle.year} • {vehicle.color}</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
            {vehicle.description || "Well-maintained, reliable vehicle equipped with modern amenities for travel in Rwanda."}
          </p>

          {/* Quick Specifications */}
          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50 rounded-xl mb-4 text-[11px] font-medium text-slate-600 border border-slate-100">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>{vehicle.seats} Seats</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-blue-600" />
              <span>{vehicle.transmission}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-blue-600" />
              <span>{vehicle.fuelType}</span>
            </div>
          </div>
        </div>

        {/* Pricing & Booking CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-600 uppercase font-bold tracking-wider block">Daily Rate</span>
            <span className="text-lg font-extrabold text-slate-900">
              {formatCurrency(vehicle.dailyRate)}
            </span>
          </div>

          <Link
            href={bookingHref}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5 ${
              isAvailable
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            {isAvailable ? "Book Now" : "View Details"}
          </Link>
        </div>
      </div>
    </div>
  );
}
