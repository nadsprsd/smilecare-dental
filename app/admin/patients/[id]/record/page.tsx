import { connectDB } from "@/lib/mongodb";
import { ObjectId }  from "mongodb";
import { cookies }   from "next/headers";
import { redirect }  from "next/navigation";
import Link          from "next/link";
import Image         from "next/image";
import PrintButton   from "@/components/PrintButton";
import type { Patient, Treatment, Invoice, Alert } from "@/lib/constants";

async function checkAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!session || session.value !== "authenticated") redirect("/admin/login");
}

async function getPatient(id: string): Promise<Patient | null> {
  try {
    const db  = await connectDB();
    const doc = await db.collection("patients").findOne({ _id: new ObjectId(id) });
    if (!doc) return null;
    return { invoices: [], ...doc, _id: doc._id.toString() } as unknown as Patient;
  } catch {
    return null;
  }
}

function formatINR(n: number): string {
  return `Rs. ${n.toLocaleString("en-IN")}`;
}

function formatDate(d: string): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export default async function PatientRecordPage({ params }: { params: Promise<{ id: string }> }) {
  await checkAuth();
  const { id } = await params;
  const patient = await getPatient(id);

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#0D1117] font-bold">Patient not found</p>
      </div>
    );
  }

  const treatments: Treatment[] = patient.treatments || [];
  const invoices: Invoice[]     = patient.invoices || [];
  const alerts: Alert[]         = patient.alerts || [];

  const totalEstimated = treatments.reduce((s, t) => s + (t.estimatedAmount || 0), 0);
  const totalPaid      = treatments.reduce((s, t) => s + (t.paidAmount || 0), 0);
  const totalBalance   = totalEstimated - totalPaid;

  return (
    <div className="min-h-screen bg-[#F4F7FA] print:bg-white">

      {/* Toolbar — hidden when printing */}
      <div className="bg-[#0D1117] px-8 py-4 print:hidden">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href={`/admin/patients/${id}`} className="text-white/60 hover:text-white text-sm">
            ← Back to patient profile
          </Link>
          <PrintButton />
        </div>
      </div>

      {/* Printable record */}
      <div className="max-w-4xl mx-auto bg-white px-10 py-12 print:p-0 print:max-w-none">

        {/* Letterhead */}
        <div className="flex items-center justify-between border-b-2 border-[#0F2E2E] pb-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 shrink-0">
              <Image src="/logo.png" alt="Vee Care Dental Clinic" fill sizes="56px" className="object-contain" />
            </div>
            <div>
              <div className="font-bold text-lg text-[#0F2E2E]">Vee Care Dental Clinic</div>
              <div className="text-xs text-[#4A5568]">R M Arcade, Vaikom Road, Udayamperoor, Ernakulam, Kerala 682307</div>
            </div>
          </div>
          <div className="text-right text-xs text-[#4A5568]">
            <div>Record generated: {formatDate(new Date().toISOString())}</div>
            <div className="font-mono mt-0.5">{patient.registrationNumber}</div>
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="bg-red-50 border border-red-200 px-5 py-3 mb-6">
            {alerts.map((a, i) => (
              <div key={i} className="text-red-700 text-sm font-semibold">⚠ {a.message}</div>
            ))}
          </div>
        )}

        {/* Personal details */}
        <section className="mb-8">
          <h2 className="text-[10px] font-bold tracking-widest uppercase text-[#4A5568] mb-3 border-b border-gray-200 pb-1.5">Personal Details</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <div><span className="text-[#4A5568]">Name:</span> <span className="font-medium text-[#0D1117]">{patient.name}</span></div>
            <div><span className="text-[#4A5568]">Age / Sex:</span> <span className="font-medium text-[#0D1117]">{patient.age}y · {patient.sex}</span></div>
            <div><span className="text-[#4A5568]">Phone:</span> <span className="font-medium text-[#0D1117]">{patient.phone}</span></div>
            <div><span className="text-[#4A5568]">Email:</span> <span className="font-medium text-[#0D1117]">{patient.email || "—"}</span></div>
            <div><span className="text-[#4A5568]">Date of Birth:</span> <span className="font-medium text-[#0D1117]">{formatDate(patient.dateOfBirth)}</span></div>
            <div><span className="text-[#4A5568]">Registered:</span> <span className="font-medium text-[#0D1117]">{formatDate(patient.createdAt)}</span></div>
            <div className="col-span-2"><span className="text-[#4A5568]">Address:</span> <span className="font-medium text-[#0D1117]">{patient.address || "—"}</span></div>
          </div>
        </section>

        {/* Medical / dental history */}
        <section className="mb-8">
          <h2 className="text-[10px] font-bold tracking-widest uppercase text-[#4A5568] mb-3 border-b border-gray-200 pb-1.5">Medical &amp; Dental History</h2>
          <div className="space-y-3 text-sm">
            <div><span className="text-[#4A5568] block text-xs mb-1">Medical History</span><span className="text-[#0D1117]">{patient.medicalHistory || "None recorded"}</span></div>
            <div><span className="text-[#4A5568] block text-xs mb-1">Dental History</span><span className="text-[#0D1117]">{patient.dentalHistory || "None recorded"}</span></div>
            <div><span className="text-[#4A5568] block text-xs mb-1">Allergies</span><span className="text-[#0D1117]">{patient.allergies || "None recorded"}</span></div>
          </div>
        </section>

        {/* Treatment history — diagnosis, lab, prescriptions */}
        <section className="mb-8">
          <h2 className="text-[10px] font-bold tracking-widest uppercase text-[#4A5568] mb-3 border-b border-gray-200 pb-1.5">
            Treatment History ({treatments.length})
          </h2>
          {treatments.length === 0 ? (
            <p className="text-sm text-[#4A5568]">No treatments recorded.</p>
          ) : (
            <div className="space-y-5">
              {[...treatments].reverse().map((t, i) => (
                <div key={t._id || i} className="text-sm border-b border-gray-100 pb-4" style={{ breakInside: "avoid" }}>
                  <div className="flex items-start justify-between mb-1">
                    <span className="font-semibold text-[#0D1117]">{t.treatment}</span>
                    <span className="text-xs text-[#4A5568]">{formatDate(t.date)}</span>
                  </div>
                  <div className="text-xs text-[#4A5568] mb-1.5">{t.doctor} · Status: {t.status}</div>
                  {t.diagnosis && <div className="text-xs text-[#0D1117] mb-1"><span className="text-[#4A5568]">Diagnosis:</span> {t.diagnosis}</div>}
                  {t.labDetails && <div className="text-xs text-[#0D1117] mb-1"><span className="text-[#4A5568]">Lab:</span> {t.labDetails}</div>}
                  {t.notes && <div className="text-xs text-[#0D1117] italic mb-1.5">{t.notes}</div>}
                  {t.prescriptions && t.prescriptions.length > 0 && (
                    <div className="mt-1.5">
                      <span className="text-xs text-[#4A5568]">Prescriptions:</span>
                      <ul className="list-disc list-inside text-xs text-[#0D1117] mt-1">
                        {t.prescriptions.map((rx, j) => (
                          <li key={j}>{rx.drug}{rx.strengthMg && ` ${rx.strengthMg}mg`} — {rx.frequency} · {rx.mealTiming} · {rx.route} · {rx.durationDays} days</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="text-xs text-[#4A5568] mt-1.5">
                    Estimated: {formatINR(t.estimatedAmount)} · Paid: {formatINR(t.paidAmount)} · Balance: {formatINR(t.estimatedAmount - t.paidAmount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Financial ledger */}
        <section className="mb-8" style={{ breakInside: "avoid" }}>
          <h2 className="text-[10px] font-bold tracking-widest uppercase text-[#4A5568] mb-3 border-b border-gray-200 pb-1.5">Financial Ledger</h2>
          <div className="text-sm space-y-1">
            <div className="flex justify-between"><span className="text-[#4A5568]">Total Estimated</span><span className="text-[#0D1117]">{formatINR(totalEstimated)}</span></div>
            <div className="flex justify-between"><span className="text-[#4A5568]">Total Paid</span><span className="text-[#0D1117]">{formatINR(totalPaid)}</span></div>
            <div className="flex justify-between font-bold text-[#C1583B] border-t border-gray-200 pt-1 mt-1"><span>Balance Due</span><span>{formatINR(totalBalance)}</span></div>
          </div>

          {invoices.length > 0 && (
            <div className="mt-4">
              <span className="text-xs text-[#4A5568] block mb-1.5">Invoice History</span>
              <div className="text-xs text-[#0D1117] space-y-1">
                {invoices.map((inv, i) => (
                  <div key={inv._id || i} className="flex justify-between">
                    <span>{inv.invoiceNo} · {formatDate(inv.createdAt)} · via {inv.sentVia}</span>
                    <span>{formatINR(inv.totalBalance)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <div className="text-center text-[10px] text-[#4A5568] pt-6 border-t border-gray-200">
          This is an official patient record from Vee Care Dental Clinic. For clinic use — patient copy available on request.
        </div>
      </div>
    </div>
  );
}
