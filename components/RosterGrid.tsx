"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { DOCTORS } from "@/lib/doctors";

const onCallDoctors = DOCTORS.filter(d => d.type === "on-call");

function nextNDays(n: number): string[] {
  const days: string[] = [];
  const d = new Date();
  for (let i = 0; i < n; i++) {
    days.push(new Date(d.getTime() + i * 86400000).toISOString().split("T")[0]);
  }
  return days;
}

export default function RosterGrid() {
  const days = nextNDays(7);
  const [status, setStatus] = useState<Record<string, string>>({}); // key = `${doctorId}_${date}`
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/roster?start=${days[0]}&end=${days[days.length - 1]}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          const map: Record<string, string> = {};
          for (const r of data.records) map[`${r.doctorId}_${r.date}`] = r.status;
          setStatus(map);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const toggle = async (doctorId: string, date: string) => {
    const key = `${doctorId}_${date}`;
    const current = status[key] || "off-site";
    const next = current === "active" ? "off-site" : "active";
    setSaving(key);
    setStatus(s => ({ ...s, [key]: next }));
    try {
      await fetch("/api/roster", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId, date, status: next }),
      });
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA]">
      <div className="bg-[#0D1117] px-6 md:px-10 py-6">
        <div className="max-w-5xl mx-auto">
          <Link href="/admin" className="flex items-center gap-1.5 text-white/50 hover:text-white text-xs mb-3">
            <ArrowLeft size={12} /> Dashboard
          </Link>
          <h1 className="text-white font-bold text-xl flex items-center gap-2">
            <Clock size={18} /> On-Call Roster
          </h1>
          <p className="text-white/50 text-xs mt-1">
            Mark each on-call specialist Active for the dates they'll be in clinic. Unmarked = not bookable that day.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-10 py-8 overflow-x-auto">
        {loading ? (
          <p className="text-sm text-[#4A5568]">Loading roster...</p>
        ) : (
          <table className="w-full text-sm border-collapse min-w-[700px]">
            <thead>
              <tr>
                <th className="text-left text-[10px] font-bold tracking-widest uppercase text-[#4A5568] pb-3 pr-4">Doctor</th>
                {days.map(d => (
                  <th key={d} className="text-center text-[10px] font-bold tracking-widest uppercase text-[#4A5568] pb-3 px-1">
                    {new Date(d + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short" })}
                    <div className="text-[9px] font-normal normal-case mt-0.5">
                      {new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {onCallDoctors.map(doc => (
                <tr key={doc.id} className="border-t border-gray-200">
                  <td className="py-3 pr-4">
                    <div className="font-semibold text-[#0D1117]">{doc.name}</div>
                    <div className="text-xs text-[#4A5568]">{doc.specialty}</div>
                  </td>
                  {days.map(d => {
                    const key = `${doc.id}_${d}`;
                    const active = status[key] === "active";
                    return (
                      <td key={d} className="text-center px-1 py-3">
                        <button
                          onClick={() => toggle(doc.id, d)}
                          disabled={saving === key}
                          className={`w-full py-2 text-[10px] font-bold uppercase transition-colors ${
                            active ? "bg-[#0F2E2E] text-white" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                          }`}
                        >
                          {active ? "Active" : "Off"}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
