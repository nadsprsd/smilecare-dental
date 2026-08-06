"use client";

import { useState } from "react";
import { X, FileText, Send, Printer, History } from "lucide-react";

type Treatment = {
  _id: string; date: string; treatment: string; doctor: string;
  notes: string; estimatedAmount: number; paidAmount: number; status: string;
};

type Invoice = {
  _id: string; invoiceNo: string; mode: "single" | "all";
  totalEstimated: number; totalPaid: number; totalBalance: number;
  sentVia: "whatsapp" | "print"; createdAt: string;
};

type Patient = {
  _id: string; name: string; registrationNumber: string; phone: string;
  treatments: Treatment[]; invoices?: Invoice[];
};

// Normalizes an Indian phone number for wa.me — same rule used elsewhere in the app
function toWaNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 ? `91${digits}` : digits;
}

function formatINR(n: number): string {
  return `Rs. ${n.toLocaleString("en-IN")}`;
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function InvoiceGenerator({
  patient,
  onClose,
  onLogged,
}: {
  patient: Patient;
  onClose: () => void;
  onLogged?: () => void;
}) {
  const [mode, setMode] = useState<"single" | "all">("all");
  const [selectedId, setSelectedId] = useState<string>(patient.treatments[0]?._id ?? "");
  const [logging, setLogging] = useState(false);

  const unpaidTreatments = patient.treatments.filter(t => t.estimatedAmount - t.paidAmount > 0);
  const lineItems: Treatment[] =
    mode === "single"
      ? patient.treatments.filter(t => t._id === selectedId)
      : unpaidTreatments;

  const totalEstimated = lineItems.reduce((s, t) => s + t.estimatedAmount, 0);
  const totalPaid      = lineItems.reduce((s, t) => s + t.paidAmount, 0);
  const totalBalance   = totalEstimated - totalPaid;

  const invoiceNo = `INV-${patient.registrationNumber}-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}`;
  const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const DIVIDER = "─────────────────────";

  // Plain-text version — shared by the WhatsApp message and the print/PDF view.
  // WhatsApp only supports *bold*, _italic_, and line breaks — no real layout —
  // so the fix for a "messy" message is generous spacing and one item per
  // block, not cramming stats onto a single line with pipe separators.
  const invoiceText = [
    `*VEE CARE DENTAL CLINIC*`,
    `_R M Arcade, Vaikom Road, Udayamperoor_`,
    ``,
    `Invoice: ${invoiceNo}`,
    `Date: ${today}`,
    ``,
    DIVIDER,
    `*Patient:* ${patient.name}`,
    `*Patient ID:* ${patient.registrationNumber}`,
    DIVIDER,
    ``,
    `*${mode === "single" ? "Treatment" : `Outstanding Treatments (${lineItems.length})`}*`,
    ``,
    ...lineItems.flatMap((t, i) => [
      `*${i + 1}. ${t.treatment}*`,
      `Doctor: ${t.doctor}`,
      `Date: ${formatDate(t.date)}`,
      `Estimated: ${formatINR(t.estimatedAmount)}`,
      `Paid: ${formatINR(t.paidAmount)}`,
      `Balance: ${formatINR(t.estimatedAmount - t.paidAmount)}`,
      ``,
    ]),
    DIVIDER,
    `Total Estimated: ${formatINR(totalEstimated)}`,
    `Total Paid: ${formatINR(totalPaid)}`,
    `*Balance Due: ${formatINR(totalBalance)}*`,
    DIVIDER,
    ``,
    `Thank you for choosing Vee Care Dental Clinic.`,
    `For any questions, just reply to this message.`,
  ].join("\n");

  const waLink = `https://wa.me/${toWaNumber(patient.phone)}?text=${encodeURIComponent(invoiceText)}`;

  const logInvoice = async (sentVia: "whatsapp" | "print") => {
    setLogging(true);
    try {
      await fetch(`/api/patients/${patient._id}/invoices`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceNo, mode,
          treatmentIds: lineItems.map(t => t._id),
          totalEstimated, totalPaid, totalBalance, sentVia,
        }),
      });
      onLogged?.();
    } finally { setLogging(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 print:bg-white print:p-0">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto print:max-h-none print:overflow-visible">

        {/* Header — hidden when printing */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 print:hidden">
          <div className="flex items-center gap-2.5">
            <FileText size={18} className="text-[#C1583B]" />
            <h3 className="font-bold text-[#0D1117]">Generate Invoice</h3>
          </div>
          <button onClick={onClose} className="text-[#4A5568] hover:text-[#0D1117]">
            <X size={20} />
          </button>
        </div>

        {/* Scope selector — hidden when printing */}
        <div className="px-7 pt-6 print:hidden">
          <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">Invoice Scope</label>
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setMode("all")}
              className={`flex-1 border-2 px-4 py-3 text-sm font-medium text-left transition-colors ${mode === "all" ? "border-[#0F2E2E] bg-[#F2EDE3]" : "border-gray-100"}`}
            >
              All Unpaid Balances
              <div className="text-xs text-[#4A5568] font-normal mt-0.5">{unpaidTreatments.length} treatment{unpaidTreatments.length !== 1 ? "s" : ""} with a balance due</div>
            </button>
            <button
              onClick={() => setMode("single")}
              className={`flex-1 border-2 px-4 py-3 text-sm font-medium text-left transition-colors ${mode === "single" ? "border-[#0F2E2E] bg-[#F2EDE3]" : "border-gray-100"}`}
            >
              Single Treatment
              <div className="text-xs text-[#4A5568] font-normal mt-0.5">Pick one visit below</div>
            </button>
          </div>

          {mode === "single" && (
            <select
              value={selectedId}
              onChange={e => setSelectedId(e.target.value)}
              className="w-full border-2 border-gray-100 focus:border-[#0F2E2E] px-4 py-3 outline-none text-sm mb-4"
            >
              {patient.treatments.map(t => (
                <option key={t._id} value={t._id}>
                  {t.treatment} — {formatDate(t.date)} (Balance: {formatINR(t.estimatedAmount - t.paidAmount)})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Invoice preview — this part prints */}
        <div className="px-7 py-6">
          <div className="border border-gray-200 p-6">
            <div className="text-center mb-6">
              <div className="font-bold text-lg text-[#0F2E2E]">Vee Care Dental Clinic</div>
              <div className="text-xs text-[#4A5568] mt-1">Invoice {invoiceNo} · {today}</div>
            </div>

            <div className="text-sm mb-5">
              <span className="font-semibold text-[#0D1117]">{patient.name}</span>
              <span className="text-[#4A5568]"> ({patient.registrationNumber})</span>
            </div>

            {lineItems.length === 0 ? (
              <p className="text-sm text-[#4A5568] text-center py-6">No treatments in this scope.</p>
            ) : (
              <div className="space-y-3 mb-5">
                {lineItems.map(t => (
                  <div key={t._id} className="flex items-start justify-between text-sm border-b border-gray-100 pb-3">
                    <div>
                      <div className="font-medium text-[#0D1117]">{t.treatment}</div>
                      <div className="text-xs text-[#4A5568]">{t.doctor} · {formatDate(t.date)}</div>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <div className="text-[#0D1117]">{formatINR(t.estimatedAmount)}</div>
                      <div className="text-xs text-green-600">Paid: {formatINR(t.paidAmount)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t-2 border-[#0D1117] pt-3 space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-[#4A5568]">Total Estimated</span><span>{formatINR(totalEstimated)}</span></div>
              <div className="flex justify-between"><span className="text-[#4A5568]">Total Paid</span><span>{formatINR(totalPaid)}</span></div>
              <div className="flex justify-between font-bold text-base text-[#C1583B]"><span>Balance Due</span><span>{formatINR(totalBalance)}</span></div>
            </div>
          </div>
        </div>

        {/* Actions — hidden when printing */}
        <div className="flex gap-3 px-7 pb-3 print:hidden">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => logInvoice("whatsapp")}
            className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-bold px-5 py-3 transition-colors"
          >
            <Send size={15} /> Send via WhatsApp
          </a>
          <button
            onClick={() => { logInvoice("print"); window.print(); }}
            className="flex items-center justify-center gap-2 border border-gray-200 text-[#0D1117] hover:border-[#0D1117] text-sm font-medium px-5 py-3 transition-colors"
          >
            <Printer size={15} /> Print
          </button>
        </div>

        {/* Recent invoice history — hidden when printing */}
        {patient.invoices && patient.invoices.length > 0 && (
          <div className="px-7 pb-7 print:hidden">
            <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-[#4A5568] mb-2 mt-2">
              <History size={12} /> Invoice History
            </div>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {[...patient.invoices].reverse().slice(0, 10).map(inv => (
                <div key={inv._id} className="flex items-center justify-between text-xs text-[#4A5568] bg-[#F2EDE3] px-3 py-2">
                  <span>{inv.invoiceNo} · {new Date(inv.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · via {inv.sentVia}</span>
                  <span className="font-medium text-[#0D1117]">Balance: {formatINR(inv.totalBalance)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
