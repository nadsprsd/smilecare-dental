"use client";

import { Printer, Send } from "lucide-react";

function toWaNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 ? `91${digits}` : digits;
}

export default function PrescriptionActions({
  phone,
  message,
}: {
  phone: string;
  message: string;
}) {
  return (
    <div className="flex gap-3">
      <a
        href={`https://wa.me/${toWaNumber(phone)}?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-bold px-4 py-2 transition-colors"
      >
        <Send size={15} /> Send via WhatsApp
      </a>
      <button
        onClick={() => window.print()}
        className="flex items-center gap-2 bg-[#C1583B] hover:bg-[#A3462C] text-white text-sm font-bold px-4 py-2 transition-colors"
      >
        <Printer size={15} /> Print / Save as PDF
      </button>
    </div>
  );
}
