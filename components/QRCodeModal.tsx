"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Vehicle } from "@/lib/types";
import { QrCode, X, Printer, Download, Check, ShieldCheck } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface QRCodeModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QRCodeModal({ vehicle, isOpen, onClose }: QRCodeModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    if (!vehicle) return;
    const vehiclePayload = JSON.stringify({
      system: "RCRMS-RWANDA",
      vehicleId: vehicle.id,
      plate: vehicle.registrationNo,
      model: `${vehicle.make} ${vehicle.model}`,
      year: vehicle.year,
      mileage: vehicle.currentMileage,
      status: vehicle.status,
      insuranceExpiry: vehicle.insuranceExpiry,
      url: typeof window !== "undefined" ? `${window.location.origin}/admin/vehicles?id=${vehicle.id}` : "",
    });

    QRCode.toDataURL(vehiclePayload, {
      width: 320,
      margin: 2,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error(err));
  }, [vehicle]);

  if (!isOpen || !vehicle) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-2 shadow-sm">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Vehicle Fleet Inspection QR
          </h3>
          <p className="text-xs text-slate-500">
            Scan via staff mobile to view real-time odometer, maintenance & active rentals
          </p>
        </div>

        {/* Printable Vehicle Badge */}
        <div className="border-2 border-dashed border-slate-300 rounded-2xl p-5 bg-slate-50 text-center flex flex-col items-center">
          <div className="bg-slate-900 text-white text-[10px] font-bold px-3 py-0.5 rounded-full mb-2 uppercase tracking-widest">
            RentaGo Rwanda Fleet Unit
          </div>

          <div className="text-lg font-black text-slate-900 tracking-wider font-mono">
            {vehicle.registrationNo}
          </div>
          <div className="text-xs font-semibold text-slate-600 mb-3">
            {vehicle.make} {vehicle.model} ({vehicle.year})
          </div>

          {/* QR Image */}
          {qrDataUrl ? (
            <div className="p-3 bg-white rounded-xl shadow-md border border-slate-200">
              <img
                src={qrDataUrl}
                alt={`QR code for ${vehicle.registrationNo}`}
                className="w-48 h-48 object-contain"
              />
            </div>
          ) : (
            <div className="w-48 h-48 flex items-center justify-center bg-slate-100 rounded-xl text-xs text-slate-400">
              Generating QR Code...
            </div>
          )}

          <div className="mt-3 grid grid-cols-2 gap-2 text-left w-full text-[11px] bg-white p-2.5 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-400 block text-[10px]">Odometer:</span>
              <span className="font-bold text-slate-800">{vehicle.currentMileage.toLocaleString()} km</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Daily Rate:</span>
              <span className="font-bold text-slate-800">{formatCurrency(vehicle.dailyRate)}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Status:</span>
              <span className="font-semibold text-blue-600">{vehicle.status}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Category:</span>
              <span className="font-semibold text-slate-700">{vehicle.categoryName || "Fleet"}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-5">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print Windshield Sticker</span>
          </button>
          {qrDataUrl && (
            <a
              href={qrDataUrl}
              download={`QR_${vehicle.registrationNo}.png`}
              className="p-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 transition flex items-center justify-center"
              title="Download PNG"
            >
              <Download className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
