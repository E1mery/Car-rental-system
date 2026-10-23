"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/components/AuthContext";
import { User, Mail, Lock, LogIn, AlertCircle, ArrowRight, ShieldCheck, UserPlus } from "lucide-react";

function CustomerLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/customer";

  const { loginCustomer, customer } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect
  React.useEffect(() => {
    if (customer) {
      router.push(redirect);
    }
  }, [customer, redirect, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const res = loginCustomer(email, password);
      if (res.success) {
        router.push(redirect);
      } else {
        setIsSubmitting(false);
        setError(res.error || "Login failed. Please check your credentials or register.");
      }
    }, 500);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-20">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
          <User className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Customer Portal Sign In
        </h1>
        <p className="text-xs text-slate-500 mt-2">
          Access your vehicle reservations, digital contracts, and payment history.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl">
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="Enter your account password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 text-xs disabled:opacity-50 mt-2"
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In to Customer Portal</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center space-y-3">
          <p className="text-xs text-slate-500">
            Don&apos;t have an account yet?
          </p>
          <Link
            href={`/customer/register?redirect=${encodeURIComponent(redirect)}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-xl border border-blue-200 transition w-full justify-center"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create New Customer Account</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Loading...</div>}>
          <CustomerLoginForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
