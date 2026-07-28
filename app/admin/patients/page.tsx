import { cookies }       from "next/headers";
import { redirect }      from "next/navigation";
import { getAllPatients } from "@/lib/patients";
import Link              from "next/link";
import { Users, Plus, Search, AlertTriangle, Phone, Calendar } from "lucide-react";

async function checkAuth() {
  const c = await cookies();
  if (c.get("admin_session")?.value !== "authenticated") redirect("/admin/login");
}

export default async function PatientsListPage() {
  await checkAuth();
  const patients = await getAllPatients();

  const withAlerts = patients.filter(p => p.alerts && p.alerts.length > 0);

  return (
    <div className="min-h-screen bg-[#F4F7FA]">

      {/* Header */}
      <div className="bg-[#0D1117] px-8 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 bg-[#C9A96E] flex items-center justify-center">
              <span className="text-[#0D1117] font-black text-base">S</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold">SmileCare</span>
                <span className="text-white/30">·</span>
                <span className="text-white/50 text-sm">Patient Records</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-white/50 hover:text-white text-xs border border-white/15 px-3 py-2 transition-colors">
              ← Dashboard
            </Link>
            <Link href="/admin/patients/new"
              className="flex items-center gap-2 bg-[#C9A96E] hover:bg-[#b8935a] text-[#0D1117] text-xs font-bold px-4 py-2 transition-colors">
              <Plus size={14} /> New Patient
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white border-t-2 border-[#0D1117] p-5 shadow-sm">
            <div className="text-[#4A5568] text-xs font-medium uppercase tracking-wide mb-2">Total Patients</div>
            <div className="text-3xl font-bold text-[#0D1117]">{patients.length}</div>
          </div>
          <div className="bg-white border-t-2 border-yellow-400 p-5 shadow-sm">
            <div className="text-[#4A5568] text-xs font-medium uppercase tracking-wide mb-2">With Alerts</div>
            <div className="text-3xl font-bold text-yellow-600">{withAlerts.length}</div>
          </div>
          <div className="bg-white border-t-2 border-[#C9A96E] p-5 shadow-sm">
            <div className="text-[#4A5568] text-xs font-medium uppercase tracking-wide mb-2">This Month</div>
            <div className="text-3xl font-bold text-[#C9A96E]">
              {patients.filter(p => {
                const d = new Date(p.createdAt);
                const n = new Date();
                return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
              }).length}
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="bg-white shadow-sm p-4 mb-6 flex items-center gap-3">
          <Search size={18} className="text-[#4A5568] shrink-0" />
          <input
            type="text"
            placeholder="Search by name, phone, registration number or email..."
            className="flex-1 outline-none text-sm text-[#0D1117] placeholder-[#4A5568]/50"
            id="patient-search"
          />
        </div>

        {/* Alerts banner */}
        {withAlerts.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 mb-6 flex items-start gap-3">
            <AlertTriangle size={16} className="text-yellow-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-yellow-800 text-sm">
                {withAlerts.length} patient{withAlerts.length > 1 ? "s" : ""} with active alerts
              </p>
              <p className="text-yellow-600 text-xs mt-0.5">
                {withAlerts.map(p => p.name).join(", ")}
              </p>
            </div>
          </div>
        )}

        {/* Patient table */}
        <div className="bg-white shadow-sm">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-[#0D1117] text-xs uppercase tracking-widest flex items-center gap-2">
              <Users size={14} className="text-[#C9A96E]" />
              All Patients ({patients.length})
            </h3>
            <Link href="/admin/patients/new"
              className="flex items-center gap-2 bg-[#0D1117] hover:bg-[#C9A96E] text-white text-xs font-bold px-4 py-2 transition-all">
              <Plus size={13} /> Add Patient
            </Link>
          </div>

          {patients.length === 0 ? (
            <div className="text-center py-20">
              <Users size={40} className="mx-auto mb-3 text-gray-200" />
              <p className="font-medium text-[#0D1117]">No patients yet</p>
              <p className="text-sm text-[#4A5568] mt-1 mb-6">Add your first patient to start building records</p>
              <Link href="/admin/patients/new"
                className="inline-flex items-center gap-2 bg-[#0D1117] text-white text-sm font-semibold px-6 py-3">
                <Plus size={15} /> Add First Patient
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Reg No","Patient","Phone","Age/Sex","Source","Alerts","Last Visit","Action"].map(h => (
                      <th key={h} className="text-left px-5 py-3.5 text-[10px] font-bold tracking-widest uppercase text-[#4A5568] bg-[#F4F7FA] whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p, idx) => {
                    const lastTreatment = p.treatments?.[p.treatments.length - 1];
                    return (
                      <tr key={p._id} className={`border-b border-gray-50 hover:bg-[#F4F7FA] transition-colors ${idx % 2 !== 0 ? "bg-[#FAFBFC]" : ""}`}>

                        {/* Reg No */}
                        <td className="px-5 py-4">
                          <span className="font-mono text-xs font-bold text-[#C9A96E]">
                            {p.registrationNumber}
                          </span>
                        </td>

                        {/* Name */}
                        <td className="px-5 py-4">
                          <div className="font-semibold text-[#0D1117] text-sm">{p.name}</div>
                          {p.email && (
                            <div className="text-xs text-[#4A5568] mt-0.5 truncate max-w-[180px]">{p.email}</div>
                          )}
                        </td>

                        {/* Phone */}
                        <td className="px-5 py-4">
                          <a href={`tel:${p.phone}`} className="flex items-center gap-1 text-xs text-[#4A5568] hover:text-[#C9A96E]">
                            <Phone size={11} /> {p.phone}
                          </a>
                        </td>

                        {/* Age/Sex */}
                        <td className="px-5 py-4">
                          <span className="text-xs text-[#0D1117]">{p.age}y · {p.sex}</span>
                        </td>

                        {/* Source */}
                        <td className="px-5 py-4">
                          <span className="text-[10px] bg-[#0D1117]/5 text-[#0D1117] px-2 py-1 font-medium">
                            {p.source}
                          </span>
                        </td>

                        {/* Alerts */}
                        <td className="px-5 py-4">
                          {p.alerts && p.alerts.length > 0 ? (
                            <div className="flex items-center gap-1 text-yellow-600">
                              <AlertTriangle size={13} />
                              <span className="text-[10px] font-bold">{p.alerts.length}</span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-gray-300">None</span>
                          )}
                        </td>

                        {/* Last Visit */}
                        <td className="px-5 py-4">
                          {lastTreatment ? (
                            <div>
                              <div className="text-xs font-medium text-[#0D1117]">
                                {new Date(lastTreatment.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                              </div>
                              <div className="text-[10px] text-[#4A5568] mt-0.5 truncate max-w-[120px]">
                                {lastTreatment.treatment}
                              </div>
                            </div>
                          ) : (
                            <span className="text-[10px] text-gray-300">No visits</span>
                          )}
                        </td>

                        {/* Action */}
                        <td className="px-5 py-4">
                          <Link href={`/admin/patients/${p._id}`}
                            className="inline-flex items-center gap-1 bg-[#0D1117] hover:bg-[#C9A96E] text-white text-[10px] font-bold px-3 py-1.5 transition-colors">
                            View Record
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

