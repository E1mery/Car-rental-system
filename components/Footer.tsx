import React from "react";
import Link from "next/link";
import { Car, MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white">
                  Renta<span className="text-blue-500">Go</span>
                </span>
                <span className="text-xs block text-slate-400">Rwanda Car Rental Management System</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Comprehensive end-to-end car rental platform combining automated booking, fleet maintenance,
              real-time inspections, digital legal agreements, and secure Mobile Money & card payments.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>Licensed & Insured Fleet in Rwanda</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/cars" className="hover:text-blue-400 transition">Browse Vehicles</Link></li>
              <li><Link href="/cars?category=Compact+SUV" className="hover:text-blue-400 transition">Compact SUVs</Link></li>
              <li><Link href="/cars?category=Full-Size+4x4" className="hover:text-blue-400 transition">Safari 4x4 Off-Roaders</Link></li>
              <li><Link href="/cars?category=Luxury+Sedan" className="hover:text-blue-400 transition">VIP & Diplomatic Sedans</Link></li>
              <li><Link href="/customer" className="hover:text-blue-400 transition">Customer Portal</Link></li>
              <li><Link href="/manager" className="hover:text-blue-400 transition">Manager Portal</Link></li>
            </ul>
          </div>

          {/* Pickup Locations */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Kigali Branches</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">Kigali International Airport (KGL)</strong>
                  Arrivals Hall Counter 4, Open 24/7
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">Kigali Convention Centre (KCC)</strong>
                  KG 2 Roundabout, Kimihurura
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">Nyarutarama Main Fleet Depot</strong>
                  KG 14 Ave, Plot 28, Kigali
                </div>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Contact & Hotline</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-200 font-semibold">+250 788 123 456 (24/7 Helpline)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>rentals@rentago.rw</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Mon - Sun: 06:00 AM - 10:00 PM</span>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">Supported Payments:</span>
                <div className="flex items-center gap-2 flex-wrap text-[10px] font-semibold text-slate-300">
                  <span className="bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded border border-yellow-500/30">MTN MoMo</span>
                  <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded border border-red-500/30">Airtel Money</span>
                  <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">Visa / Card</span>
                  <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">Cash & BK</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} RentaGo — Rwanda Car Rental Management System (RCRMS). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Powered by Next.js 14, Tailwind CSS, Prisma & SQLite</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
