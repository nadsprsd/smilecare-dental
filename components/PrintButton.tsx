"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-2 bg-[#C1583B] hover:bg-[#A3462C] text-white text-sm font-bold px-4 py-2 transition-colors"
    >
      <Printer size={15} /> Print / Save as PDF
    </button>
  );
}
