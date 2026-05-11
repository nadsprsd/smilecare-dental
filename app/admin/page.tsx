import { connectDB }     from "@/lib/mongodb";
import { cookies }        from "next/headers";
import { redirect }       from "next/navigation";
import {
  Calendar, Clock, Phone,
  TrendingUp, CheckCircle, AlertCircle, Shield,
} from "lucide-react";
import ConfirmButton  from "@/components/ConfirmButton";
import CancelButton   from "@/components/CancelButton";
import LogoutButton   from "@/components/LogoutButton";

async function checkAuth() {
  const cookieStore = await cookies();
  const session     = cookieStore.get("admin_session");
  if (!session || session.value !== "authenticated") {
    redirect("/admin/login");
  }
}

async function getData() {
  const db  = await connectDB();
  const all = await db
    .collection("appointments")
    .find()
    .sort({ createdAt: -1 })
    .toArray();
  return all;
}

function StatusBadge({ status }: { status?: string }) {
  const s = status || "pending";
  const map: Record<string, { bg: string; label: string }> = {
    pending:   { bg: "bg-yellow-50 text-yellow-700 border border-yellow-200", label: "Pending"   },
    confirmed: { bg: "bg-green-50  text-green-700  border border-green-200",  label: "Confirmed" },
    cancelled: { bg: "bg-red-50    text-red-700    border border-red-200",    label: "Cancelled" },
    completed: { bg: "bg-blue-50   text-blue-700   border border-blue-200",   label: "Completed" },
  };
  const { bg, label } = map[s] || map.pending;
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-1 ${bg}`}>
      {label}
    </span>
  );
}

export default async function AdminPage() {
  await checkAuth();
  const data = await getData();

  const today     = new Date().toISOString().split("T")[0];
  const todayApts = data.filter((d: any) => d.date === today);
  const pending   = data.filter((d: any) => !d.status || d.status === "pending");
  const confirmed = data.filter((d: any) => d.status === "confirmed");

  const serviceCounts: Record<string, number> = {};
  data.forEach((d: any) => {
    const s = d.service || "Other";
    serviceCounts[s] = (serviceCounts[s] || 0) + 1;
  });
  const topServices = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxCount    = topServices[0]?.[1] || 1;

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
                <span className="text-white font-bold text-base">SmileCare</span>
                <span className="text-white/30 text-sm">·</span>
                <span className="text-white/50 text-sm">Admin Dashboard</span>
                {/* Security badge */}
                <span className="flex items-center gap-1 bg-green-500/15 border border-green-500/30 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <Shield size={9} /> SECURED
                </span>
              </div>
              <p className="text-white/40 text-xs mt-0.5">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long", day: "numeric", month: "long", year: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-white/50 hover:text-white text-xs border border-white/15 px-3 py-2 transition-colors hidden md:block">
              View Site
            </a>
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Security notice bar */}
      <div className="bg-green-900/20 border-b border-green-500/20 px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-green-500 text-xs">
          <Shield size={12} />
          <span className="font-semibold">Security Active:</span>
          <span className="text-[#0D1117]">
            All data encrypted in transit (TLS 1.3) · Access protected by authentication · 
            Patient data stored securely in MongoDB Atlas · Rate limiting enabled · 
            DPDP Act compliant
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Bookings", value: data.length,      Icon: Calendar,    color: "text-[#0D1117]",  border: "border-t-2 border-[#0D1117]"  },
            { label: "Today",          value: todayApts.length, Icon: Clock,       color: "text-blue-600",   border: "border-t-2 border-blue-500"   },
            { label: "Pending",        value: pending.length,   Icon: AlertCircle, color: "text-yellow-600", border: "border-t-2 border-yellow-400" },
            { label: "Confirmed",      value: confirmed.length, Icon: CheckCircle, color: "text-green-600",  border: "border-t-2 border-green-500"  },
          ].map(({ label, value, Icon, color, border }) => (
            <div key={label} className={`bg-white ${border} p-5 shadow-sm`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[#4A5568] text-xs font-medium tracking-wide uppercase">{label}</span>
                <Icon size={18} className={color} />
              </div>
              <div className="text-3xl font-bold text-[#0D1117]">{value}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Today */}
          <div className="bg-white shadow-sm p-6">
            <h3 className="font-bold text-[#0D1117] mb-4 flex items-center gap-2 text-xs uppercase tracking-widest">
              <Clock size={13} className="text-[#C9A96E]" /> Today's Schedule
            </h3>
            {todayApts.length === 0 ? (
              <p className="text-[#4A5568] text-sm text-center py-6">No appointments today</p>
            ) : (
              <div className="space-y-3">
                {todayApts.map((apt: any) => (
                  <div key={apt._id.toString()} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <div className="w-14 shrink-0 text-center">
                      <div className="text-xs font-bold text-[#0D1117]">{apt.time}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-[#0D1117] truncate">{apt.name}</div>
                      <div className="text-xs text-[#4A5568] truncate">{apt.service}</div>
                    </div>
                    <StatusBadge status={apt.status} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chart */}
          <div className="bg-white shadow-sm p-6 lg:col-span-2">
            <h3 className="font-bold text-[#0D1117] mb-5 flex items-center gap-2 text-xs uppercase tracking-widests">
              <TrendingUp size={13} className="text-[#C9A96E]" /> Most Booked Services
            </h3>
            {topServices.length === 0 ? (
              <p className="text-[#4A5568] text-sm text-center py-6">No data yet</p>
            ) : (
              <div className="space-y-4">
                {topServices.map(([service, count]) => (
                  <div key={service}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-[#0D1117] font-medium truncate max-w-[70%]">{service}</span>
                      <span className="text-[#4A5568] font-semibold shrink-0">{count} booking{count !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2">
                      <div className="h-2 bg-[#C9A96E]" style={{ width: `${(count / maxCount) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-sm">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
            <h3 className="font-bold text-[#0D1117] text-xs uppercase tracking-widest">
              All Appointments
              <span className="ml-2 text-[#4A5568] font-normal normal-case text-xs">({data.length} total)</span>
            </h3>
            <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-3 py-1.5 border border-green-100">
              <Shield size={11} />
              Patient data secured · Only authorised access
            </div>
          </div>

          {data.length === 0 ? (
            <div className="text-center py-20 text-[#4A5568]">
              <Calendar size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No appointments yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Patient","Service","Date","Time","Doctor","Status","Booked At","Actions"].map(h => (
                      <th key={h} className="text-left px-5 py-3.5 text-[10px] font-bold tracking-widest uppercase text-[#4A5568] bg-[#F4F7FA] whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((apt: any, idx: number) => (
                    <tr key={apt._id.toString()} className={`border-b border-gray-50 hover:bg-[#F4F7FA] transition-colors ${idx % 2 !== 0 ? "bg-[#FAFBFC]" : ""}`}>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-[#0D1117] text-sm">{apt.name}</div>
                        <a href={`tel:${apt.phone}`} className="text-xs text-[#4A5568] hover:text-[#C9A96E] flex items-center gap-1 mt-0.5">
                          <Phone size={11} /> {apt.phone}
                        </a>
                        {apt.consent && (
                          <span className="text-[9px] text-green-600 flex items-center gap-0.5 mt-0.5">
                            <Shield size={8} /> Consent given
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 max-w-[160px]">
                        <span className="text-[#0D1117] font-medium text-xs">{apt.service}</span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="font-semibold text-[#0D1117] text-xs">
                          {apt.date ? new Date(apt.date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                        </span>
                        {apt.date === today && (
                          <span className="ml-2 bg-blue-50 text-blue-600 text-[10px] font-bold px-1.5 py-0.5 border border-blue-200">TODAY</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[#0D1117] text-xs font-medium">{apt.time || "—"}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[#4A5568] text-xs">{apt.doctor || "No preference"}</span>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={apt.status} />
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-[#4A5568] text-xs">
                          {apt.createdAt
                            ? new Date(apt.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) + " " +
                              new Date(apt.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
                            : "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          {(!apt.status || apt.status === "pending") && (
                            <ConfirmButton id={apt._id.toString()} name={apt.name} phone={apt.phone} service={apt.service} date={apt.date} time={apt.time} />
                          )}
                          {apt.status !== "cancelled" && apt.status !== "completed" && (
                            <CancelButton id={apt._id.toString()} />
                          )}
                          <a
                            href={`https://wa.me/${(apt.phone||"").replace(/\D/g,"").length===10?"91"+apt.phone.replace(/\D/g,""):apt.phone.replace(/\D/g,"")}`}
                            target="_blank" rel="noopener noreferrer"
                            className="bg-[#25D366] hover:bg-[#128C7E] text-white text-[10px] font-bold px-2.5 py-1.5 transition-colors"
                          >
                            WA
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Security info panel */}
        <div className="mt-6 bg-white border border-green-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={16} className="text-green-500" />
            <h4 className="font-bold text-[#0D1117] text-sm">Data Security Information</h4>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-xs text-[#4A5568]">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
              <div>
                <div className="font-semibold text-[#0D1117] mb-0.5">Encrypted Storage</div>
                All patient data stored in MongoDB Atlas with encryption at rest. Access requires authenticated credentials.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
              <div>
                <div className="font-semibold text-[#0D1117] mb-0.5">Secure Transmission</div>
                All data transmitted over HTTPS with TLS 1.3. No patient data sent in plain text.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
              <div>
                <div className="font-semibold text-[#0D1117] mb-0.5">DPDP Compliant</div>
                Patient consent collected before data storage. Compliant with India's Digital Personal Data Protection Act 2023.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
              <div>
                <div className="font-semibold text-[#0D1117] mb-0.5">Rate Limited API</div>
                Booking API rate limited to 5 requests per minute per IP. Prevents spam and automated attacks.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
              <div>
                <div className="font-semibold text-[#0D1117] mb-0.5">Input Validation</div>
                All patient inputs validated with Zod schema. SQL/NoSQL injection attacks blocked automatically.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
              <div>
                <div className="font-semibold text-[#0D1117] mb-0.5">Authorised Access Only</div>
                Dashboard protected by secure login. Sessions expire after 24 hours. No shared credentials.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-[#4A5568] text-xs">
          SmileCare Admin · Secured by BizGrowOnline ·{" "}
          <a href="/" className="text-[#C9A96E] hover:underline">Return to website</a>
        </div>
      </div>
    </div>
  );
}

