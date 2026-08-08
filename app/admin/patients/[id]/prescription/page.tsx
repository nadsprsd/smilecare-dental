import { connectDB } from "@/lib/mongodb";
import { ObjectId }  from "mongodb";
import { cookies }   from "next/headers";
import { redirect }  from "next/navigation";
import Link          from "next/link";
import Image         from "next/image";
import PrescriptionActions from "@/components/PrescriptionActions";
import type { Patient, Treatment } from "@/lib/constants";

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

function formatDate(d: string): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export default async function PrescriptionReportPage({ params }: { params: Promise<{ id: string }> }) {
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

  // Only treatments that actually have prescriptions attached, most recent first —
  // this is deliberately narrower than the Full Record: just what medicine to
  // take, when, and how, nothing else.
  const treatments: Treatment[] = (patient.treatments || [])
    .filter(t => t.prescriptions && t.prescriptions.length > 0)
    .reverse();

  const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  // Plain-text version for WhatsApp — same clean-spacing approach as the invoice
  const message = [
    `*VEE CARE DENTAL CLINIC*`,
    `_R M Arcade, Vaikom Road, Udayamperoor_`,
    ``,
    `Prescription for: ${patient.name} (${patient.registrationNumber})`,
    `Date: ${today}`,
    ``,
    `─────────────────────`,
    ...treatments.flatMap(t => [
      `*${t.treatment}* — ${formatDate(t.date)} (${t.doctor})`,
      ...(t.prescriptions || []).map(rx =>
        `• ${rx.drug}${rx.strengthMg ? ` ${rx.strengthMg}mg` : ""} — ${rx.frequency}, ${rx.mealTiming}, ${rx.route}, ${rx.durationDays} days`
      ),
      ``,
    ]),
    `─────────────────────`,
    `Take medicines exactly as prescribed. Contact the clinic if you notice any reaction.`,
  ].join("\n");

  return (
    <div className="min-h-screen bg-[#F4F7FA] print:bg-white">

      {/* Toolbar — hidden when printing */}
      <div className="bg-[#0D1117] px-8 py-4 print:hidden">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href={`/admin/patients/${id}`} className="text-white/60 hover:text-white text-sm">
            ← Back to patient profile
          </Link>
          <PrescriptionActions phone={patient.phone} message={message} />
        </div>
      </div>

      {/* Printable report */}
      <div className="max-w-3xl mx-auto bg-white px-10 py-12 print:p-0 print:max-w-none">

        {/* Letterhead */}
        <div className="flex items-center justify-between border-b-2 border-[#0F2E2E] pb-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 shrink-0">
              <Image src="/logo.png" alt="Vee Care Dental Clinic" fill sizes="48px" className="object-contain" />
            </div>
            <div>
              <div className="font-bold text-lg text-[#0F2E2E]">Vee Care Dental Clinic</div>
              <div className="text-xs text-[#4A5568]">R M Arcade, Vaikom Road, Udayamperoor, Ernakulam, Kerala 682307</div>
            </div>
          </div>
          <div className="text-right text-xs text-[#4A5568]">
            <div>Prescription printed: {today}</div>
            <div className="font-mono mt-0.5">{patient.registrationNumber}</div>
          </div>
        </div>

        <h1 className="text-xl font-bold text-[#0D1117] mb-1">Prescription Report</h1>
        <p className="text-sm text-[#4A5568] mb-8">
          {patient.name} · {patient.age}y · {patient.sex} · {patient.phone}
        </p>

        {treatments.length === 0 ? (
          <p className="text-sm text-[#4A5568]">No prescriptions on record for this patient.</p>
        ) : (
          <div className="space-y-8">
            {treatments.map((t, i) => (
              <div key={t._id || i} style={{ breakInside: "avoid" }}>
                <div className="flex items-baseline justify-between border-b border-gray-200 pb-2 mb-3">
                  <h2 className="font-semibold text-[#0D1117]">{t.treatment}</h2>
                  <span className="text-xs text-[#4A5568]">{formatDate(t.date)} · {t.doctor}</span>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[10px] uppercase tracking-wide text-[#4A5568]">
                      <th className="pb-2 pr-3">Medicine</th>
                      <th className="pb-2 pr-3">Frequency</th>
                      <th className="pb-2 pr-3">When</th>
                      <th className="pb-2 pr-3">Route</th>
                      <th className="pb-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(t.prescriptions || []).map((rx, j) => (
                      <tr key={j} className="border-t border-gray-100">
                        <td className="py-2 pr-3 font-medium text-[#0D1117]">
                          {rx.drug}{rx.strengthMg && ` ${rx.strengthMg}mg`}
                        </td>
                        <td className="py-2 pr-3 text-[#4A5568]">{rx.frequency}</td>
                        <td className="py-2 pr-3 text-[#4A5568]">{rx.mealTiming}</td>
                        <td className="py-2 pr-3 text-[#4A5568]">{rx.route}</td>
                        <td className="py-2 text-[#4A5568]">{rx.durationDays} days</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        <div className="text-center text-[10px] text-[#4A5568] pt-10 mt-10 border-t border-gray-200">
          Take medicines exactly as prescribed. Contact Vee Care Dental Clinic if you notice any adverse reaction.
        </div>
      </div>
    </div>
  );
}
