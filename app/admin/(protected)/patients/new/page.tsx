"use client";
import { useState }  from "react";
import { useRouter } from "next/navigation";
import Link          from "next/link";
import { ArrowLeft, Save, Loader, Plus, Trash2 } from "lucide-react";
import { SOURCES, getISTDateString } from "@/lib/constants";

export default function NewPatientPage() {
  const router  = useRouter();
  const [saving, setSaving] = useState(false);
  const [form,   setForm]   = useState({
    name:           "",
    phone:          "",
    email:          "",
    sex:            "Male",
    dateOfBirth:    "",
    age:            "",
    address:        "",
    source:         "Walk-in",
    medicalHistory: "",
    dentalHistory:  "",
    allergies:      "",
  });
  const [alerts, setAlerts] = useState<{ type: string; message: string }[]>([]);
  const [newAlert, setNewAlert] = useState({ type: "warning", message: "" });

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const addAlert = () => {
    if (!newAlert.message.trim()) return;
    setAlerts(a => [...a, { ...newAlert }]);
    setNewAlert({ type: "warning", message: "" });
  };

  const removeAlert = (i: number) => setAlerts(a => a.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    if (!form.name || !form.phone) { alert("Name and phone are required"); return; }
    setSaving(true);
    try {
      const res  = await fetch("/api/patients", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ ...form, age: Number(form.age) || 0, alerts }),
      });
      const data = await res.json();
      if (!data.success) { alert("Failed to save patient."); return; }
      router.push(`/admin/patients/${data.id}`);
      router.refresh();
    } catch { alert("Something went wrong."); }
    finally  { setSaving(false); }
  };

  return (
    <div>

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-8 py-5 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/patients" className="text-[#4A5568] hover:text-[#0D1117]">
              <ArrowLeft size={18} />
            </Link>
            <span className="font-bold text-[#0D1117]">New Patient</span>
          </div>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 bg-[#C1583B] hover:bg-[#A3462C] text-white text-xs font-bold px-5 py-2.5 transition-all disabled:opacity-50">
            {saving ? <Loader size={14} className="animate-spin" /> : <Save size={14} />}
            Save Patient
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">

        {/* Personal Details */}
        <div className="bg-white shadow-sm p-7">
          <h3 className="font-bold text-[#0D1117] text-sm uppercase tracking-widest mb-6 pb-3 border-b border-gray-100">
            Personal Details
          </h3>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="label-field">Full Name *</label>
              <input type="text" value={form.name} onChange={e => set("name", e.target.value)}
                placeholder="Patient full name" maxLength={100}
                className="input-field" style={{ fontSize: "16px" }} />
            </div>
            <div>
              <label className="label-field">Phone Number *</label>
              <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)}
                placeholder="10-digit mobile number" maxLength={15}
                className="input-field" style={{ fontSize: "16px" }} />
            </div>
            <div>
              <label className="label-field">Email Address</label>
              <input type="email" value={form.email} onChange={e => set("email", e.target.value)}
                placeholder="patient@email.com" maxLength={254}
                className="input-field" style={{ fontSize: "16px" }} />
            </div>
            <div>
              <label className="label-field">Sex</label>
              <select value={form.sex} onChange={e => set("sex", e.target.value)} className="input-field" style={{ fontSize: "16px" }}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="label-field">Date of Birth</label>
              <input type="date" value={form.dateOfBirth} max={getISTDateString()} onChange={e => {
                const dob = new Date(e.target.value);
                const age = Math.max(0, Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000)));
                set("dateOfBirth", e.target.value);
                set("age", String(age));
              }} className="input-field" style={{ fontSize: "16px" }} />
            </div>
            <div>
              <label className="label-field">Age</label>
              <input type="number" value={form.age} onChange={e => set("age", e.target.value)}
                placeholder="Age in years" min="0" max="120"
                className="input-field" style={{ fontSize: "16px" }} />
            </div>
            <div className="md:col-span-2">
              <label className="label-field">Address</label>
              <input type="text" value={form.address} onChange={e => set("address", e.target.value)}
                placeholder="Street, area, city" maxLength={300}
                className="input-field" style={{ fontSize: "16px" }} />
            </div>
            <div>
              <label className="label-field">Source (How did they find us?)</label>
              <select value={form.source} onChange={e => set("source", e.target.value)} className="input-field" style={{ fontSize: "16px" }}>
                {SOURCES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Medical History */}
        <div className="bg-white shadow-sm p-7">
          <h3 className="font-bold text-[#0D1117] text-sm uppercase tracking-widest mb-6 pb-3 border-b border-gray-100">
            Medical & Dental History
          </h3>
          <div className="space-y-5">
            <div>
              <label className="label-field">Medical History</label>
              <p className="text-[#4A5568] text-xs mb-2">Existing conditions, medications, surgeries</p>
              <textarea value={form.medicalHistory} onChange={e => set("medicalHistory", e.target.value)}
                rows={3} placeholder="e.g. Diabetes Type 2, BP medication (Amlodipine 5mg), thyroid..." maxLength={5000}
                className="input-field resize-none" style={{ fontSize: "16px" }} />
            </div>
            <div>
              <label className="label-field">Dental History</label>
              <p className="text-[#4A5568] text-xs mb-2">Previous dental treatments, extractions, issues</p>
              <textarea value={form.dentalHistory} onChange={e => set("dentalHistory", e.target.value)}
                rows={3} placeholder="e.g. Root canal on tooth 16 (2022), extraction tooth 48 (2019)..." maxLength={5000}
                className="input-field resize-none" style={{ fontSize: "16px" }} />
            </div>
            <div>
              <label className="label-field">Allergies</label>
              <input type="text" value={form.allergies} onChange={e => set("allergies", e.target.value)}
                placeholder="e.g. Penicillin, latex, local anaesthesia..." maxLength={1000}
                className="input-field" style={{ fontSize: "16px" }} />
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white shadow-sm p-7">
          <h3 className="font-bold text-[#0D1117] text-sm uppercase tracking-widest mb-2 pb-3 border-b border-gray-100">
            Alerts
          </h3>
          <p className="text-[#4A5568] text-xs mb-5">
            Alerts appear prominently in red when you open this patient's record. Use for important warnings.
          </p>

          {/* Existing alerts */}
          {alerts.length > 0 && (
            <div className="space-y-2 mb-5">
              {alerts.map((a, i) => (
                <div key={i} className={`flex items-center justify-between p-3 border ${
                  a.type === "danger"  ? "bg-red-50 border-red-200" :
                  a.type === "warning" ? "bg-yellow-50 border-yellow-200" :
                  "bg-blue-50 border-blue-200"
                }`}>
                  <span className="text-sm font-medium text-[#0D1117]">{a.message}</span>
                  <button onClick={() => removeAlert(i)} className="text-red-400 hover:text-red-600 ml-3">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add new alert */}
          <div className="flex gap-3">
            <select value={newAlert.type} onChange={e => setNewAlert(a => ({ ...a, type: e.target.value }))}
              className="border-2 border-gray-100 focus:border-[#0D1117] px-3 py-2.5 outline-none text-sm shrink-0">
              <option value="danger">Danger</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
            <input type="text" value={newAlert.message}
              onChange={e => setNewAlert(a => ({ ...a, message: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && addAlert()}
              placeholder="e.g. Diabetic patient — check BP before treatment"
              className="flex-1 border-2 border-gray-100 focus:border-[#0D1117] px-4 py-2.5 outline-none text-sm"
              style={{ fontSize: "16px" }} />
            <button onClick={addAlert}
              className="flex items-center gap-1 bg-[#0D1117] hover:bg-[#C1583B] text-white text-xs font-bold px-4 py-2.5 transition-all shrink-0">
              <Plus size={13} /> Add
            </button>
          </div>
        </div>

        {/* Save button */}
        <button onClick={handleSave} disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-[#0D1117] hover:bg-[#C1583B] text-white font-bold py-4 text-sm transition-all disabled:opacity-50">
          {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Saving..." : "Save Patient Record"}
        </button>
      </div>

      <style jsx>{`
        .label-field { display: block; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #0D1117; margin-bottom: 8px; }
        .input-field { width: 100%; border: 2px solid #F0F0F0; padding: 12px 16px; outline: none; transition: border-color 0.2s; font-size: 14px; }
        .input-field:focus { border-color: #0D1117; }
      `}</style>
    </div>
  );
}

