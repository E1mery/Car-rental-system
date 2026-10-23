import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthContext";

export const metadata: Metadata = {
  title: "RentaGo Rwanda — Car Rental Management System",
  description: "Enterprise Car Rental System for fleet management, customer portal, bookings, maintenance, and digital payments in Rwanda.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
        <AuthProvider>
          <div className="flex-1 flex flex-col">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
