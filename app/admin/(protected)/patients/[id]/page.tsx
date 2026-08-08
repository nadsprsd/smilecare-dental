"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Phone, Mail, AlertTriangle, Plus,
  Loader, Save, Trash2, Image as ImageIcon, Calendar,
  User, FileText, Activity, Shield,
} from "lucide-react";
import { SOURCES, TREATMENT_TYPES, XRAY_TYPES, MEDICATIONS, FREQUENCY_OPTIONS, MEAL_TIMING_OPTIONS, ROUTE_OPTIONS, getISTDateString } from "@/lib/constants";
import { DOCTORS, doctorsForService } from "@/lib/doctors";
import { normalizeImageUrl } from "@/lib/validation";
import InvoiceGenerator from "@/components/InvoiceGenerator";

type Alert = { type: string; message: string };
type Prescription = {
  drug: string; strengthMg: string; durationDays: number;
  frequency: string; mealTiming: string; route: string;
};
type Treatment = {
  _id: string; date: string; treatment: string; doctor: string;
  notes: string; estimatedAmount: number; paidAmount: number; status: string;
  diagnosis?: string; labDetails?: string; prescriptions?: Prescription[];
};
type XRay = { _id: string; url: string; date: string; type: string; notes: string };
type Invoice = {
  _id: string; invoiceNo: string; mode: "single" | "all";
  totalEstimated: number; totalPaid: number; totalBalance: number;
  sentVia: "whatsapp" | "print"; createdAt: string;
};
type Patient = {
  _id: string; registrationNumber: string; name: string; phone: string;
  email: string; sex: string; dateOfBirth: string; age: number;
  address: string; source: string; medicalHistory: string;
  dentalHistory: string; allergies: string; alerts: Alert[];
  treatments: Treatment[]; xrays: XRay[]; invoices?: Invoice[]; createdAt: string;
};

const TABS = ["Overview", "Treatments", "X-Rays & Images", "Edit Details"] as const;
type Tab = typeof TABS[number];

export default function PatientProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id     = params.id as string;

  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [patient,  setPatient]  = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  // Treatment form
  const [showTreatForm, setShowTreatForm] = useState(false);
  const [treatForm,     setTreatForm]     = useState({
    date: getISTDateString(),
    treatment: "", doctor: "", notes: "",
    estimatedAmount: "", paidAmount: "", status: "planned",
    diagnosis: "", labDetails: "",
  });

  // Prescription builder — a treatment can carry multiple prescriptions
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [rxDraft, setRxDraft] = useState({
    drug: "", strengthMg: "", durationDays: "",
    frequency: FREQUENCY_OPTIONS[1], mealTiming: MEAL_TIMING_OPTIONS[0], route: ROUTE_OPTIONS[0],
  });

  const addPrescriptionToDraft = () => {
    if (!rxDraft.drug.trim()) { alert("Select or type a drug name"); return; }
    setPrescriptions(list => [...list, {
      drug: rxDraft.drug.trim(),
      strengthMg: rxDraft.strengthMg.trim(),
      durationDays: Number(rxDraft.durationDays) || 0,
      frequency: rxDraft.frequency,
      mealTiming: rxDraft.mealTiming,
      route: rxDraft.route,
    }]);
    setRxDraft({ drug: "", strengthMg: "", durationDays: "", frequency: FREQUENCY_OPTIONS[1], mealTiming: MEAL_TIMING_OPTIONS[0], route: ROUTE_OPTIONS[0] });
  };

  const removePrescriptionFromDraft = (index: number) => {
    setPrescriptions(list => list.filter((_, i) => i !== index));
  };

  // XRay form
  const [showXrayForm, setShowXrayForm] = useState(false);
  const [xrayForm,     setXrayForm]     = useState({
    url: "", date: getISTDateString(),
    type: "Full Mouth X-Ray (OPG)", notes: "",
  });

  // Edit form
  const [editForm, setEditForm] = useState<Partial<Patient>>({});

  // Invoice modal
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res  = await fetch(`/api/patients/${id}`);
        const data = await res.json();
        if (data.success) {
          setPatient(data.patient);
          setEditForm(data.patient);
        }
      } catch { alert("Could not load patient."); }
      finally  { setLoading(false); }
    }
    load();
  }, [id]);

  const reload = async () => {
    const res  = await fetch(`/api/patients/${id}`);
    const data = await res.json();
    if (data.success) { setPatient(data.patient); setEditForm(data.patient); }
  };

  const addTreatment = async () => {
    if (!treatForm.treatment || !treatForm.doctor) { alert("Treatment and doctor are required"); return; }
    setSaving(true);
    try {
      const res  = await fetch(`/api/patients/${id}/treatments`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...treatForm,
          estimatedAmount: Number(treatForm.estimatedAmount) || 0,
          paidAmount: Number(treatForm.paidAmount) || 0,
          prescriptions,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await reload();
        setShowTreatForm(false);
        setTreatForm({ date: getISTDateString(), treatment: "", doctor: "", notes: "", estimatedAmount: "", paidAmount: "", status: "planned", diagnosis: "", labDetails: "" });
        setPrescriptions([]);
      }
    } finally { setSaving(false); }
  };

  const addXray = async () => {
    if (!xrayForm.url) { alert("Image URL is required"); return; }
    setSaving(true);
    try {
      const res  = await fetch(`/api/patients/${id}/xrays`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(xrayForm),
      });
      const data = await res.json();
      if (data.success) {
        await reload();
        setShowXrayForm(false);
        setXrayForm({ url: "", date: getISTDateString(), type: "Full Mouth X-Ray (OPG)", notes: "" });
      } else {
        alert(data.message || "Couldn't save this image.");
      }
    } finally { setSaving(false); }
  };

  const deleteXray = async (xrayId: string) => {
    if (!confirm("Delete this image?")) return;
    await fetch(`/api/patients/${id}/xrays`, {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ xrayId }),
    });
    await reload();
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      const res  = await fetch(`/api/patients/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (data.success) { await reload(); alert("Patient details updated."); }
    } finally { setSaving(false); }
  };

  const deletePatient = async () => {
    if (!confirm(`Permanently delete ${patient?.name}?\n\nAll records will be lost.`)) return;
    await fetch(`/api/patients/${id}`, { method: "DELETE" });
    router.push("/admin/patients");
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F4F7FA] flex items-center justify-center">
      <Loader size={24} className="animate-spin text-[#4A5568]" />
    </div>
  );

  if (!patient) return (
    <div className="min-h-screen bg-[#F4F7FA] flex items-center justify-center">
      <div className="text-center">
        <p className="text-[#0D1117] font-bold">Patient not found</p>
        <Link href="/admin/patients" className="text-[#C1583B] text-sm mt-2 block">← Back to patients</Link>
      </div>
    </div>
  );

  const totalEstimated = patient.treatments.reduce((s, t) => s + (t.estimatedAmount || 0), 0);
  const totalPaid      = patient.treatments.reduce((s, t) => s + (t.paidAmount || 0), 0);
  const balance        = totalEstimated - totalPaid;

  return (
    <div className="min-h-screen bg-[#F4F7FA]">

      {/* Header */}
      <div className="bg-[#0D1117] px-8 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/patients" className="text-white/50 hover:text-white">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <span className="text-white font-bold text-lg">{patient.name}</span>
                <span className="font-mono text-[#C1583B] text-sm">{patient.registrationNumber}</span>
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-white/40 text-xs">{patient.age}y · {patient.sex}</span>
                <span className="text-white/20">·</span>
                <span className="text-white/40 text-xs">{patient.source}</span>
                <span className="text-white/20">·</span>
                <span className="text-white/40 text-xs">{patient.treatments.length} treatment{patient.treatments.length !== 1 ? "s" : ""}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href={`tel:${patient.phone}`}
              className="flex items-center gap-1.5 border border-white/20 text-white/70 hover:text-white text-xs px-3 py-2 transition-colors">
              <Phone size={13} /> Call
            </a>
            <a href={`https://wa.me/${patient.phone.replace(/\D/g,"").length===10?"91"+patient.phone.replace(/\D/g,""):patient.phone.replace(/\D/g,"")}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-2 transition-colors">
              WA
            </a>
            <button onClick={() => setShowInvoice(true)}
              className="flex items-center gap-1.5 bg-[#C1583B] hover:bg-[#A3462C] text-white text-xs font-bold px-3 py-2 transition-colors">
              <FileText size={13} /> Invoice
            </button>
            <Link href={`/admin/patients/${id}/record`} target="_blank"
              className="flex items-center gap-1.5 border border-white/20 text-white/70 hover:text-white text-xs px-3 py-2 transition-colors">
              <FileText size={13} /> Full Record
            </Link>
            <Link href={`/admin/patients/${id}/prescription`} target="_blank"
              className="flex items-center gap-1.5 border border-white/20 text-white/70 hover:text-white text-xs px-3 py-2 transition-colors">
              <FileText size={13} /> Prescriptions
            </Link>
            <button onClick={deletePatient}
              className="border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs px-3 py-2 transition-all">
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Alerts banner */}
      {patient.alerts && patient.alerts.length > 0 && (
        <div className="bg-red-600 px-8 py-3">
          <div className="max-w-7xl mx-auto">
            {patient.alerts.map((a, i) => (
              <div key={i} className="flex items-center gap-3 text-white">
                <AlertTriangle size={16} className="shrink-0" />
                <span className="font-bold text-sm">{a.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 px-8">
        <div className="max-w-7xl mx-auto flex gap-0">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab
                  ? "border-[#C1583B] text-[#0D1117]"
                  : "border-transparent text-[#4A5568] hover:text-[#0D1117]"
              }`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "Overview" && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">

              {/* Financial summary */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Total Estimated", value: `₹${totalEstimated.toLocaleString("en-IN")}`, color: "border-[#0D1117]" },
                  { label: "Total Paid",       value: `₹${totalPaid.toLocaleString("en-IN")}`,      color: "border-green-500" },
                  { label: "Balance Due",      value: `₹${balance.toLocaleString("en-IN")}`,        color: balance > 0 ? "border-red-500" : "border-gray-200" },
                ].map(s => (
                  <div key={s.label} className={`bg-white border-t-2 ${s.color} p-5 shadow-sm`}>
                    <div className="text-[#4A5568] text-xs mb-2 font-medium uppercase tracking-wide">{s.label}</div>
                    <div className="text-2xl font-bold text-[#0D1117]">{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Recent treatments */}
              <div className="bg-white shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-[#0D1117] text-xs uppercase tracking-widest flex items-center gap-2">
                    <Activity size={13} className="text-[#C1583B]" /> Recent Treatments
                  </h3>
                  <button onClick={() => setActiveTab("Treatments")} className="text-[#C1583B] text-xs hover:underline">
                    View all →
                  </button>
                </div>
                {patient.treatments.length === 0 ? (
                  <p className="text-[#4A5568] text-sm text-center py-6">No treatments recorded yet</p>
                ) : (
                  <div className="space-y-3">
                    {[...patient.treatments].reverse().slice(0, 3).map(t => (
                      <div key={t._id} className="flex items-start justify-between py-3 border-b border-gray-50 last:border-0">
                        <div>
                          <div className="font-semibold text-sm text-[#0D1117]">{t.treatment}</div>
                          <div className="text-xs text-[#4A5568] mt-0.5">{t.doctor} · {new Date(t.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                          {t.notes && <div className="text-xs text-[#4A5568] mt-1 italic">{t.notes}</div>}
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <div className="text-sm font-bold text-[#0D1117]">₹{t.estimatedAmount.toLocaleString("en-IN")}</div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 mt-1 inline-block ${
                            t.status === "completed"   ? "bg-green-50 text-green-700" :
                            t.status === "in-progress" ? "bg-blue-50 text-blue-700" :
                            t.status === "planned"     ? "bg-yellow-50 text-yellow-700" :
                            "bg-gray-50 text-gray-600"
                          }`}>{t.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right sidebar */}
            <div className="space-y-5">
              <div className="bg-white shadow-sm p-6">
                <h3 className="font-bold text-[#0D1117] text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                  <User size={13} className="text-[#C1583B]" /> Contact Info
                </h3>
                <div className="space-y-3 text-sm">
                  <div><span className="text-[#4A5568] text-xs">Phone</span><div className="font-medium text-[#0D1117]">{patient.phone}</div></div>
                  {patient.email && <div><span className="text-[#4A5568] text-xs">Email</span><div className="font-medium text-[#0D1117]">{patient.email}</div></div>}
                  {patient.address && <div><span className="text-[#4A5568] text-xs">Address</span><div className="font-medium text-[#0D1117]">{patient.address}</div></div>}
                  <div><span className="text-[#4A5568] text-xs">Registered</span><div className="font-medium text-[#0D1117]">{new Date(patient.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</div></div>
                </div>
              </div>

              {patient.medicalHistory && (
                <div className="bg-white shadow-sm p-6">
                  <h3 className="font-bold text-[#0D1117] text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Shield size={13} className="text-red-500" /> Medical History
                  </h3>
                  <p className="text-sm text-[#4A5568] leading-relaxed">{patient.medicalHistory}</p>
                </div>
              )}

              {patient.allergies && (
                <div className="bg-red-50 border border-red-200 p-5">
                  <h3 className="font-bold text-red-700 text-xs uppercase tracking-widest mb-2">Allergies</h3>
                  <p className="text-sm text-red-600 font-medium">{patient.allergies}</p>
                </div>
              )}

              {patient.dentalHistory && (
                <div className="bg-white shadow-sm p-6">
                  <h3 className="font-bold text-[#0D1117] text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                    <FileText size={13} className="text-[#C1583B]" /> Dental History
                  </h3>
                  <p className="text-sm text-[#4A5568] leading-relaxed">{patient.dentalHistory}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TREATMENTS TAB ── */}
        {activeTab === "Treatments" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-[#0D1117] text-sm uppercase tracking-widests">
                Treatment History ({patient.treatments.length})
              </h3>
              <button onClick={() => setShowTreatForm(true)}
                className="flex items-center gap-2 bg-[#0D1117] hover:bg-[#C1583B] text-white text-xs font-bold px-4 py-2.5 transition-all">
                <Plus size={13} /> Add Treatment
              </button>
            </div>

            {/* Add treatment form */}
            {showTreatForm && (
              <div className="bg-white shadow-sm p-7 mb-6 border-l-4 border-[#C1583B]">
                <h4 className="font-bold text-[#0D1117] mb-5">New Treatment</h4>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">Date</label>
                    <input type="date" value={treatForm.date} onChange={e => setTreatForm(f => ({ ...f, date: e.target.value }))}
                      className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">Treatment *</label>
                    <select value={treatForm.treatment} onChange={e => setTreatForm(f => ({ ...f, treatment: e.target.value, doctor: "" }))}
                      className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none text-sm">
                      <option value="">Select treatment</option>
                      {TREATMENT_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">Doctor *</label>
                    <select value={treatForm.doctor} onChange={e => setTreatForm(f => ({ ...f, doctor: e.target.value }))}
                      className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none text-sm">
                      <option value="">Select doctor</option>
                      {/* Only shows doctors who actually treat the selected service — falls back to
                          the full roster for generic types (Consultation, X-Ray, Other) that aren't
                          tied to a specific specialist. */}
                      {(treatForm.treatment && doctorsForService(treatForm.treatment).length > 0
                        ? doctorsForService(treatForm.treatment)
                        : DOCTORS
                      ).map(d => (
                        <option key={d.id} value={d.name}>{d.name} — {d.specialty}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">Status</label>
                    <select value={treatForm.status} onChange={e => setTreatForm(f => ({ ...f, status: e.target.value }))}
                      className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none text-sm">
                      <option value="planned">Planned</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">Estimated Amount (₹)</label>
                    <input type="number" value={treatForm.estimatedAmount} onChange={e => setTreatForm(f => ({ ...f, estimatedAmount: e.target.value }))}
                      placeholder="0" className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">Amount Paid (₹)</label>
                    <input type="number" value={treatForm.paidAmount} onChange={e => setTreatForm(f => ({ ...f, paidAmount: e.target.value }))}
                      placeholder="0" className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">Notes</label>
                    <textarea value={treatForm.notes} onChange={e => setTreatForm(f => ({ ...f, notes: e.target.value }))}
                      rows={2} placeholder="Treatment notes, observations..."
                      className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none text-sm resize-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">Treatment Diagnosis</label>
                    <textarea value={treatForm.diagnosis} onChange={e => setTreatForm(f => ({ ...f, diagnosis: e.target.value }))}
                      rows={2} placeholder="e.g. Irreversible pulpitis, tooth #36"
                      className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none text-sm resize-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">Patient Lab Details</label>
                    <textarea value={treatForm.labDetails} onChange={e => setTreatForm(f => ({ ...f, labDetails: e.target.value }))}
                      rows={2} placeholder="e.g. Shade A2, Zirconia crown ordered from XYZ lab"
                      className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none text-sm resize-none" />
                  </div>
                </div>

                {/* ── Prescription builder ── */}
                <div className="border-t border-gray-100 pt-5 mb-4">
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-3">Prescriptions</label>

                  <div className="grid md:grid-cols-6 gap-3 mb-3">
                    <div className="md:col-span-2">
                      <input
                        list="medication-list"
                        value={rxDraft.drug}
                        onChange={e => setRxDraft(f => ({ ...f, drug: e.target.value }))}
                        placeholder="Drug name"
                        className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-3 py-2.5 outline-none text-sm"
                      />
                      <datalist id="medication-list">
                        {MEDICATIONS.map(m => <option key={m} value={m} />)}
                      </datalist>
                    </div>
                    <input
                      value={rxDraft.strengthMg}
                      onChange={e => setRxDraft(f => ({ ...f, strengthMg: e.target.value }))}
                      placeholder="Strength (mg)"
                      className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-3 py-2.5 outline-none text-sm"
                    />
                    <input
                      type="number"
                      value={rxDraft.durationDays}
                      onChange={e => setRxDraft(f => ({ ...f, durationDays: e.target.value }))}
                      placeholder="Days"
                      className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-3 py-2.5 outline-none text-sm"
                    />
                    <select value={rxDraft.frequency} onChange={e => setRxDraft(f => ({ ...f, frequency: e.target.value }))}
                      className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-2 py-2.5 outline-none text-xs">
                      {FREQUENCY_OPTIONS.map(f => <option key={f}>{f}</option>)}
                    </select>
                    <select value={rxDraft.mealTiming} onChange={e => setRxDraft(f => ({ ...f, mealTiming: e.target.value }))}
                      className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-2 py-2.5 outline-none text-xs">
                      {MEAL_TIMING_OPTIONS.map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <select value={rxDraft.route} onChange={e => setRxDraft(f => ({ ...f, route: e.target.value }))}
                      className="border-2 border-gray-100 focus:border-[#0D1117] px-3 py-2.5 outline-none text-xs">
                      {ROUTE_OPTIONS.map(r => <option key={r}>{r}</option>)}
                    </select>
                    <button type="button" onClick={addPrescriptionToDraft}
                      className="flex items-center gap-1.5 bg-[#0F2E2E] hover:bg-[#C1583B] text-white text-xs font-bold px-4 py-2.5 transition-all">
                      <Plus size={13} /> Add to Prescription
                    </button>
                  </div>

                  {prescriptions.length > 0 && (
                    <div className="space-y-2 mb-2">
                      {prescriptions.map((rx, i) => (
                        <div key={i} className="flex items-center justify-between bg-[#F2EDE3] px-4 py-2.5 text-xs">
                          <span>
                            <strong>{rx.drug}</strong>{rx.strengthMg && ` ${rx.strengthMg}mg`} — {rx.frequency} · {rx.mealTiming} · {rx.route} · {rx.durationDays} days
                          </span>
                          <button type="button" onClick={() => removePrescriptionFromDraft(i)} className="text-red-500 hover:text-red-700 ml-3">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button onClick={addTreatment} disabled={saving}
                    className="flex items-center gap-2 bg-[#0D1117] hover:bg-[#C1583B] text-white text-sm font-bold px-6 py-3 transition-all disabled:opacity-50">
                    {saving ? <Loader size={14} className="animate-spin" /> : <Save size={14} />} Save Treatment
                  </button>
                  <button onClick={() => { setShowTreatForm(false); setPrescriptions([]); }}
                    className="border border-gray-200 text-[#4A5568] hover:text-[#0D1117] text-sm px-6 py-3 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {patient.treatments.length === 0 ? (
              <div className="bg-white shadow-sm text-center py-20">
                <Activity size={40} className="mx-auto mb-3 text-gray-200" />
                <p className="font-medium text-[#0D1117]">No treatments recorded</p>
                <button onClick={() => setShowTreatForm(true)} className="mt-4 inline-flex items-center gap-2 bg-[#0D1117] text-white text-sm font-bold px-5 py-2.5">
                  <Plus size={14} /> Add First Treatment
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {[...patient.treatments].reverse().map(t => (
                  <div key={t._id} className="bg-white shadow-sm p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className="font-bold text-[#0D1117]">{t.treatment}</span>
                          <span className={`text-[10px] font-bold px-2.5 py-1 ${
                            t.status === "completed"   ? "bg-green-50 text-green-700 border border-green-200" :
                            t.status === "in-progress" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                            t.status === "planned"     ? "bg-yellow-50 text-yellow-700 border border-yellow-200" :
                            "bg-gray-50 text-gray-600 border border-gray-200"
                          }`}>{t.status}</span>
                        </div>
                        <div className="text-sm text-[#4A5568]">
                          {t.doctor} · {new Date(t.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                        </div>
                        {t.notes && <div className="text-sm text-[#4A5568] mt-2 italic">{t.notes}</div>}
                        {t.diagnosis && (
                          <div className="text-sm text-[#0D1117] mt-3">
                            <span className="text-[10px] font-bold tracking-widest uppercase text-[#4A5568]">Diagnosis:</span> {t.diagnosis}
                          </div>
                        )}
                        {t.labDetails && (
                          <div className="text-sm text-[#0D1117] mt-1">
                            <span className="text-[10px] font-bold tracking-widest uppercase text-[#4A5568]">Lab:</span> {t.labDetails}
                          </div>
                        )}
                        {t.prescriptions && t.prescriptions.length > 0 && (
                          <div className="mt-3">
                            <span className="text-[10px] font-bold tracking-widest uppercase text-[#4A5568]">Prescription:</span>
                            <div className="mt-1.5 space-y-1">
                              {t.prescriptions.map((rx, i) => (
                                <div key={i} className="text-xs text-[#4A5568] bg-[#F2EDE3] px-3 py-1.5 inline-block mr-2 mb-1">
                                  <strong className="text-[#0D1117]">{rx.drug}</strong>{rx.strengthMg && ` ${rx.strengthMg}mg`} — {rx.frequency} · {rx.mealTiming} · {rx.route} · {rx.durationDays}d
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-right shrink-0 ml-6">
                        <div className="text-lg font-bold text-[#0D1117]">₹{t.estimatedAmount.toLocaleString("en-IN")}</div>
                        <div className="text-xs text-green-600 mt-0.5">Paid: ₹{t.paidAmount.toLocaleString("en-IN")}</div>
                        {t.estimatedAmount - t.paidAmount > 0 && (
                          <div className="text-xs text-red-500 mt-0.5">Due: ₹{(t.estimatedAmount - t.paidAmount).toLocaleString("en-IN")}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── X-RAYS TAB ── */}
        {activeTab === "X-Rays & Images" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-[#0D1117] text-sm uppercase tracking-widest">
                X-Rays & Images ({patient.xrays.length})
              </h3>
              <button onClick={() => setShowXrayForm(true)}
                className="flex items-center gap-2 bg-[#0D1117] hover:bg-[#C1583B] text-white text-xs font-bold px-4 py-2.5 transition-all">
                <Plus size={13} /> Add Image
              </button>
            </div>

            {showXrayForm && (
              <div className="bg-white shadow-sm p-7 mb-6 border-l-4 border-[#C1583B]">
                <h4 className="font-bold text-[#0D1117] mb-5">Add X-Ray / Image</h4>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">Image URL *</label>
                    <input type="url" value={xrayForm.url} onChange={e => setXrayForm(f => ({ ...f, url: e.target.value }))}
                      placeholder="Paste a Google Drive, Google Photos, or Imgur link"
                      className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none text-sm" />
                    <p className="text-xs text-[#4A5568] mt-1">
                      Google Drive share links (drive.google.com/file/d/.../view) are converted automatically —
                      no need to find the "direct" link yourself. Only Google Drive, Google Photos, and Imgur links are accepted.
                    </p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">Type</label>
                    <select value={xrayForm.type} onChange={e => setXrayForm(f => ({ ...f, type: e.target.value }))}
                      className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none text-sm">
                      {XRAY_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">Date</label>
                    <input type="date" value={xrayForm.date} onChange={e => setXrayForm(f => ({ ...f, date: e.target.value }))}
                      className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">Notes</label>
                    <input type="text" value={xrayForm.notes} onChange={e => setXrayForm(f => ({ ...f, notes: e.target.value }))}
                      placeholder="e.g. Pre-treatment OPG, shows bone loss in region 36"
                      className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none text-sm" />
                  </div>
                </div>
                {xrayForm.url && (
                  <div className="mb-4">
                    <p className="text-xs text-[#4A5568] mb-2">Preview:</p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={normalizeImageUrl(xrayForm.url)} alt="Preview" className="max-h-48 border border-gray-200" onError={e => (e.currentTarget.style.display = "none")} />
                  </div>
                )}
                <div className="flex gap-3">
                  <button onClick={addXray} disabled={saving}
                    className="flex items-center gap-2 bg-[#0D1117] hover:bg-[#C1583B] text-white text-sm font-bold px-6 py-3 transition-all disabled:opacity-50">
                    {saving ? <Loader size={14} className="animate-spin" /> : <Save size={14} />} Save Image
                  </button>
                  <button onClick={() => setShowXrayForm(false)}
                    className="border border-gray-200 text-[#4A5568] hover:text-[#0D1117] text-sm px-6 py-3 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {patient.xrays.length === 0 ? (
              <div className="bg-white shadow-sm text-center py-20">
                <ImageIcon size={40} className="mx-auto mb-3 text-gray-200" />
                <p className="font-medium text-[#0D1117]">No images uploaded</p>
                <button onClick={() => setShowXrayForm(true)} className="mt-4 inline-flex items-center gap-2 bg-[#0D1117] text-white text-sm font-bold px-5 py-2.5">
                  <Plus size={14} /> Add First Image
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...patient.xrays].reverse().map(x => (
                  <div key={x._id} className="bg-white shadow-sm overflow-hidden">
                    <div className="relative aspect-video bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={x.url}
                        alt={x.type}
                        className="w-full h-full object-cover"
                        onError={e => {
                          e.currentTarget.style.display = "none";
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                          if (fallback) fallback.style.display = "flex";
                        }}
                      />
                      <div className="hidden absolute inset-0 items-center justify-center bg-gray-50 text-center px-3">
                        <span className="text-[11px] text-[#4A5568]">
                          Couldn&apos;t load this image — the URL may need to be a direct image link (not a Google Drive/Photos share page).
                        </span>
                      </div>
                      <button onClick={() => deleteXray(x._id)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded transition-colors">
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="font-semibold text-sm text-[#0D1117]">{x.type}</div>
                      <div className="text-xs text-[#4A5568] mt-1">
                        {new Date(x.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                      {x.notes && <div className="text-xs text-[#4A5568] mt-1 italic">{x.notes}</div>}
                      <a href={x.url} target="_blank" rel="noopener noreferrer"
                        className="inline-block mt-3 text-[#00A3E0] text-xs hover:underline">
                        Open full size →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── EDIT DETAILS TAB ── */}
        {activeTab === "Edit Details" && (
          <div className="max-w-3xl space-y-6">
            <div className="bg-white shadow-sm p-7">
              <h3 className="font-bold text-[#0D1117] text-sm uppercase tracking-widest mb-6">Personal Details</h3>
              <div className="grid md:grid-cols-2 gap-5">
                {[
                  { label: "Full Name",   key: "name",  type: "text" },
                  { label: "Phone",       key: "phone", type: "tel"  },
                  { label: "Email",       key: "email", type: "email"},
                  { label: "Age",         key: "age",   type: "number"},
                  { label: "Address",     key: "address",type: "text"},
                ].map(f => (
                  <div key={f.key} className={f.key === "address" ? "md:col-span-2" : ""}>
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">{f.label}</label>
                    <input type={f.type} value={(editForm as any)[f.key] || ""}
                      onChange={e => setEditForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none text-sm" />
                  </div>
                ))}
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">Sex</label>
                  <select value={(editForm as any).sex || "Male"} onChange={e => setEditForm(p => ({ ...p, sex: e.target.value }))}
                    className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none text-sm">
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">Source</label>
                  <select value={(editForm as any).source || ""} onChange={e => setEditForm(p => ({ ...p, source: e.target.value }))}
                    className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none text-sm">
                    {SOURCES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-sm p-7">
              <h3 className="font-bold text-[#0D1117] text-sm uppercase tracking-widest mb-6">Medical Information</h3>
              <div className="space-y-4">
                {[
                  { label: "Medical History", key: "medicalHistory", placeholder: "Existing conditions, medications..." },
                  { label: "Dental History",  key: "dentalHistory",  placeholder: "Previous treatments, extractions..." },
                  { label: "Allergies",       key: "allergies",      placeholder: "Drug allergies, latex..." },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">{f.label}</label>
                    <textarea rows={3} value={(editForm as any)[f.key] || ""}
                      onChange={e => setEditForm(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none text-sm resize-none" />
                  </div>
                ))}
              </div>
            </div>

            <button onClick={saveEdit} disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-[#0D1117] hover:bg-[#C1583B] text-white font-bold py-4 text-sm transition-all disabled:opacity-50">
              {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      {showInvoice && (
        <InvoiceGenerator patient={patient} onClose={() => setShowInvoice(false)} onLogged={reload} />
      )}
    </div>
  );
}

