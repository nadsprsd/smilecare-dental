import { getAllPatients } from "@/lib/patients";
import Link from "next/link";
import { Plus } from "lucide-react";
import PatientsTable from "@/components/admin/PatientsTable";

export default async function PatientsListPage() {
  const patients = await getAllPatients();
  const withAlerts = patients.filter(p => p.alerts && p.alerts.length > 0);

  return (
    <div>
      <div className="bg-white border-b border-gray-100 px-8 py-6 flex items-center justify-between">
        <h1 className="font-bold text-xl text-[#0D1117]">Patient Records</h1>
        <Link href="/admin/patients/new"
          className="flex items-center gap-2 bg-[#C1583B] hover:bg-[#A3462C] text-white text-xs font-bold px-4 py-2 transition-colors">
          <Plus size={14} /> New Patient
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-8 py-8">

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
          <div className="bg-white border-t-2 border-[#C1583B] p-5 shadow-sm">
            <div className="text-[#4A5568] text-xs font-medium uppercase tracking-wide mb-2">This Month</div>
            <div className="text-3xl font-bold text-[#C1583B]">
              {patients.filter(p => {
                const d = new Date(p.createdAt);
                const n = new Date();
                return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
              }).length}
            </div>
          </div>
        </div>

        <PatientsTable patients={patients as any} />
      </div>
    </div>
  );
}
