"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ManagerIndexRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin");
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
      <div className="text-center space-y-2">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-400 font-semibold">Opening Manager Portal...</p>
      </div>
    </div>
  );
}
