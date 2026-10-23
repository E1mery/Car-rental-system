"use client";

import React, { useRef, useState, useEffect } from "react";
import { Eraser, Check, PenTool } from "lucide-react";

interface SignaturePadProps {
  label: string;
  onSave: (signatureData: string) => void;
  defaultName?: string;
}

export function SignaturePad({ label, onSave, defaultName }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Set line appearance
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#1e3a8a"; // Dark blue signature ink
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasSignature(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    onSave(canvas.toDataURL());
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onSave("");
  };

  return (
    <div className="border border-slate-300 rounded-xl p-3 bg-slate-50">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <PenTool className="w-3.5 h-3.5 text-blue-600" />
          {label}
        </span>
        <button
          type="button"
          onClick={clear}
          className="text-[11px] text-slate-500 hover:text-red-600 flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-slate-200"
        >
          <Eraser className="w-3 h-3" /> Clear
        </button>
      </div>

      <div className="relative bg-white rounded-lg border-2 border-dashed border-slate-300 overflow-hidden cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={360}
          height={120}
          className="w-full h-[120px] touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {!hasSignature && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-xs italic">
            Sign here with mouse, pen, or finger...
          </div>
        )}
      </div>
      {defaultName && (
        <div className="mt-1.5 text-[11px] text-slate-500">
          Signatory: <span className="font-semibold text-slate-700">{defaultName}</span>
        </div>
      )}
    </div>
  );
}
