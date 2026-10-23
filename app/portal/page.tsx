"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LegacyPortalRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/customer");
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="text-center space-y-2">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-500 font-semibold">Redirecting to Customer Portal...</p>
      </div>
    </div>
  );
}
