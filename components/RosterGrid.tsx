"use client";

import { useEffect, useState } from "react";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { DOCTORS } from "@/lib/doctors";
import { getISTDateString } from "@/lib/constants";

const onCallDoctors  = DOCTORS.filter(d => d.type === "on-call");
const fullTimeDoctors = DOCTORS.filter(d => d.type === "full-time");

// weekOffset 0 = the 7 days starting today, 1 = the next 7 days, etc.
function daysForWeek(weekOffset: number): string[] {
  const days: string[] = [];
  const base = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(base.getTime() + (weekOffset * 7 + i) * 86400000);
    days.push(getISTDateString(d));
  }
  return days;
}

export default function RosterGrid() {
  const [weekOffset, setWeekOffset] = useState(0);
  const days = daysForWeek(weekOffset);
  const [status, setStatus] = useState<Record<string, string>>({}); // key = `${doctorId}_${date}`
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
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
  }, [weekOffset]);

  // On-call doctors: not bookable unless explicitly marked "active".
  // Full-time doctors: bookable by default, unless explicitly marked "off-site" (e.g. on leave).
  const isDisplayedActive = (doctorId: string, date: string, isFullTime: boolean) => {
    const key = `${doctorId}_${date}`;
    const raw = status[key];
    return isFullTime ? raw !== "off-site" : raw === "active";
  };

  const toggle = async (doctorId: string, date: string, isFullTime: boolean) => {
    const key = `${doctorId}_${date}`;
    const currentlyActive = isDisplayedActive(doctorId, date, isFullTime);
    const next = currentlyActive ? "off-site" : "active";
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
    <div>
      <div className="bg-white border-b border-gray-100 px-6 md:px-10 py-6">
        <h1 className="font-bold text-xl text-[#0D1117] flex items-center gap-2">
          <Clock size={18} /> On-Call Roster
        </h1>
        <p className="text-[#4A5568] text-xs mt-1">
          Mark each on-call specialist Active for the dates they&apos;ll be in clinic. Unmarked = not bookable that day.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-10 py-8">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setWeekOffset(w => Math.max(0, w - 1))}
            disabled={weekOffset === 0}
            className="flex items-center gap-1 text-xs font-medium text-[#4A5568] hover:text-[#0D1117] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={14} /> Previous Week
          </button>
          <span className="text-sm font-semibold text-[#0D1117]">
            {new Date(days[0] + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            {" – "}
            {new Date(days[6] + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </span>
          <button
            onClick={() => setWeekOffset(w => w + 1)}
            className="flex items-center gap-1 text-xs font-medium text-[#4A5568] hover:text-[#0D1117]"
          >
            Next Week <ChevronRight size={14} />
          </button>
        </div>

        <div className="overflow-x-auto">
        {loading ? (
          <p className="text-sm text-[#4A5568]">Loading roster...</p>
        ) : (
          <>
          <h2 className="text-xs font-bold tracking-widest uppercase text-[#4A5568] mb-2">Full-Time Team</h2>
          <p className="text-[#4A5568] text-xs mb-3">
            Bookable every day by default for any service. Only toggle a day Off if one of them is on leave.
          </p>
          <table className="w-full text-sm border-collapse min-w-[700px] mb-10">
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
              {fullTimeDoctors.map(doc => (
                <tr key={doc.id} className="border-t border-gray-200">
                  <td className="py-3 pr-4">
                    <div className="font-semibold text-[#0D1117]">{doc.name}</div>
                    <div className="text-xs text-[#4A5568]">{doc.specialty}</div>
                  </td>
                  {days.map(d => {
                    const key = `${doc.id}_${d}`;
                    const active = isDisplayedActive(doc.id, d, true);
                    return (
                      <td key={d} className="text-center px-1 py-3">
                        <button
                          onClick={() => toggle(doc.id, d, true)}
                          disabled={saving === key}
                          className={`w-full py-2 text-[10px] font-bold uppercase transition-colors ${
                            active ? "bg-[#0F2E2E] text-white" : "bg-red-50 text-red-600 hover:bg-red-100"
                          }`}
                        >
                          {active ? "Active" : "On Leave"}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="text-xs font-bold tracking-widest uppercase text-[#4A5568] mb-2">On-Call Specialists</h2>
          <p className="text-[#4A5568] text-xs mb-3">
            Not bookable unless marked Active for that specific date.
          </p>
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
                    const active = isDisplayedActive(doc.id, d, false);
                    return (
                      <td key={d} className="text-center px-1 py-3">
                        <button
                          onClick={() => toggle(doc.id, d, false)}
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
          </>
        )}
        </div>
      </div>
    </div>
  );
}

