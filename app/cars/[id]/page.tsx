"use client";

import React, { Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PriceCalculator } from "@/components/PriceCalculator";
import { getVehicles } from "@/lib/store";
import { Vehicle } from "@/lib/types";
import { formatCurrency, getStatusBadgeClass, formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  Users,
  Fuel,
  Gauge,
  Calendar,
  ShieldCheck,
  CheckCircle,
  FileText,
  AlertCircle,
  Sparkles,
  MapPin,
  Clock,
} from "lucide-react";

function CarDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = params.id as string;
  const initialStart = searchParams.get("start") || new Date().toISOString().split("T")[0];
  const initialEnd = searchParams.get("end") || new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0];

  const [vehicle, setVehicle] = React.useState<Vehicle | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const list = getVehicles();
    const found = list.find((v) => v.id === id) || null;
    setVehicle(found);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex-1 max-w-lg mx-auto px-4 py-20 text-center space-y-4">
          <h2 className="text-2xl font-black text-slate-800">Vehicle Not Found</h2>
          <p className="text-xs text-slate-500">The requested fleet vehicle is unavailable or does not exist.</p>
          <Link href="/cars" className="inline-block px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl">
            Browse Available Fleet &rarr;
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Breadcrumb Navigation */}
      <div className="bg-slate-100 border-b border-slate-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-800">Home</Link>
            <span>/</span>
            <Link href="/cars" className="hover:text-slate-800">Fleet</Link>
            <span>/</span>
            <span className="font-semibold text-slate-800">{vehicle.make} {vehicle.model}</span>
          </div>
        </div>
      </div>

      <main className="flex-1 py-8 sm:py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              href="/cars"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Fleet Catalog</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Photos & Vehicle Specifications (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Main Image Banner */}
              <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative group">
                <img
                  src={vehicle.imageUrl || "https://images.unsplash.com/photo-1581540222194-0def2dda95b8?auto=format&fit=crop&w=1200&q=80"}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full aspect-[16/10] object-cover"
                />

                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border backdrop-blur-md shadow-sm ${getStatusBadgeClass(
                      vehicle.status
                    )}`}
                  >
                    {vehicle.status === "AVAILABLE" && "🟢 Available for Booking"}
                    {vehicle.status === "RESERVED" && "🔵 Currently Reserved"}
                    {vehicle.status === "RENTED" && "🟠 On Rental"}
                    {vehicle.status === "MAINTENANCE" && "🔴 Scheduled Maintenance"}
                    {vehicle.status === "UNAVAILABLE" && "⚫ Unavailable"}
                  </span>
                </div>

                <div className="absolute bottom-3 right-4 bg-slate-900/90 text-white font-mono text-xs font-bold px-3 py-1 rounded-lg backdrop-blur-md">
                  Plate: {vehicle.registrationNo}
                </div>
              </div>

              {/* Title & Overview */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                      {vehicle.categoryName}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      Odometer: <strong className="text-slate-800">{vehicle.currentMileage.toLocaleString()} km</strong>
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {vehicle.make} {vehicle.model} ({vehicle.year})
                  </h1>
                  <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                    {vehicle.description}
                  </p>
                </div>

                {/* Technical Specifications Grid */}
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                    Technical Specifications
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[11px] text-slate-400 block">Seats</span>
                      <strong className="text-xs text-slate-800 font-bold">{vehicle.seats} Passengers</strong>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[11px] text-slate-400 block">Transmission</span>
                      <strong className="text-xs text-slate-800 font-bold">{vehicle.transmission}</strong>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[11px] text-slate-400 block">Fuel Type</span>
                      <strong className="text-xs text-slate-800 font-bold">{vehicle.fuelType}</strong>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[11px] text-slate-400 block">Exterior Color</span>
                      <strong className="text-xs text-slate-800 font-bold">{vehicle.color}</strong>
                    </div>
                  </div>
                </div>

                {/* Features & Amenities */}
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                    Features & Equipment
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {vehicle.features?.map((feat, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Maintenance & Compliance Transparency */}
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Inspection & Roadworthiness</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Insurance Expiry:</span>
                      <span className="font-semibold text-slate-700">{formatDate(vehicle.insuranceExpiry)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Technical Inspection:</span>
                      <span className="font-semibold text-slate-700">{formatDate(vehicle.inspectionExpiry)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Last Service:</span>
                      <span className="font-semibold text-slate-700">{formatDate(vehicle.lastServiceDate)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Price Calculator & Booking Checkout (5 cols) */}
            <div className="lg:col-span-5 sticky top-20">
              <PriceCalculator
                vehicle={vehicle}
                initialStart={initialStart}
                initialEnd={initialEnd}
              />

              {/* Rental Policies Card */}
              <div className="mt-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-xs text-slate-600 space-y-2.5">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Rental Terms & Conditions</span>
                </div>
                <ul className="space-y-1.5 list-disc list-inside text-slate-500">
                  <li>Valid Driving License (Category B) & National ID/Passport required.</li>
                  <li>Fuel Policy: Same-to-Same (Return with outgoing fuel level).</li>
                  <li>Unlimited mileage within Kigali & National Parks.</li>
                  <li>Deposit is refundable upon vehicle return inspection.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CarDetailPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-500">Loading car details...</div>}>
      <CarDetailContent />
    </Suspense>
  );
}
