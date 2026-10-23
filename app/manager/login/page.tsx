"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/components/AuthContext";
import {
  ShieldCheck,
  Mail,
  Lock,
  LogIn,
  AlertCircle,
  Car,
  Key,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

function ManagerLoginForm() {
  const router = useRouter();
  const { loginManager, isManagerAuth } = useAuth();

  const [email, setEmail] = useState("manager@rentago.rw");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (isManagerAuth) {
      router.push("/admin");
    }
  }, [isManagerAuth, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const res = loginManager(email, password);
      if (res.success) {
        router.push("/admin");
      } else {
        setIsSubmitting(false);
        setError(res.error || "Authentication failed. Invalid manager credentials.");
      }
    }, 500);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-20">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white mx-auto flex items-center justify-center shadow-xl shadow-slate-900/20 mb-4 border border-slate-700">
          <ShieldCheck className="w-7 h-7 text-amber-400" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Manager Portal Login
        </h1>
        <p className="text-xs text-slate-500 mt-2">
          Operations, Fleet Management & Customer Bookings Control Suite
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        {/* Credentials info helper badge */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <Key className="w-3.5 h-3.5 text-amber-500" />
            <span>Manager Default Credentials:</span>
          </div>
          <div className="flex justify-between font-mono text-[11px] text-slate-700 pt-1">
            <span>Email: <strong>manager@rentago.rw</strong></span>
            <span>Password: <strong>admin123</strong></span>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Manager Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="manager@rentago.rw"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Manager Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl transition shadow-lg shadow-slate-900/25 flex items-center justify-center gap-2 text-xs disabled:opacity-50 mt-2"
          >
            {isSubmitting ? (
              <span>Authenticating staff access...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4 text-amber-400" />
                <span>Enter Manager Portal</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Need to book a car as a customer instead?{" "}
            <Link href="/customer/login" className="text-blue-600 hover:text-blue-800 font-bold">
              Customer Portal &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ManagerLoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Loading...</div>}>
          <ManagerLoginForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
