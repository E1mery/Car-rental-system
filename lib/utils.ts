import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) return "0 RWF";
  return new Intl.NumberFormat("en-RW", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(amount) + " RWF";
}

export function formatDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return "N/A";
  const d = new Date(dateString);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(dateString: string | Date | null | undefined): string {
  if (!dateString) return "N/A";
  const d = new Date(dateString);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function calculateDaysBetween(startDate: string | Date, endDate: string | Date): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
}

export function getStatusBadgeClass(status: string) {
  switch (status.toUpperCase()) {
    case "AVAILABLE":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/30";
    case "RESERVED":
      return "bg-blue-500/10 text-blue-600 border-blue-500/30";
    case "RENTED":
    case "ACTIVE":
      return "bg-amber-500/10 text-amber-600 border-amber-500/30";
    case "MAINTENANCE":
      return "bg-red-500/10 text-red-600 border-red-500/30";
    case "COMPLETED":
      return "bg-indigo-500/10 text-indigo-600 border-indigo-500/30";
    case "CANCELLED":
    case "UNAVAILABLE":
      return "bg-zinc-500/10 text-zinc-600 border-zinc-500/30";
    default:
      return "bg-slate-100 text-slate-700 border-slate-300";
  }
}
