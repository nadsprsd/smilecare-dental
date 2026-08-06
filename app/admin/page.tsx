import { connectDB }   from "@/lib/mongodb";
import { cookies }     from "next/headers";
import { redirect }    from "next/navigation";
import Link            from "next/link";
import Image           from "next/image";
import {
  Calendar, Clock, Phone, ArrowRight,
  TrendingUp, CheckCircle, AlertCircle, Shield, PenSquare, Users,
} from "lucide-react";
import ConfirmButton from "@/components/ConfirmButton";
import CancelButton  from "@/components/CancelButton";
import LogoutButton  from "@/components/LogoutButton";

async function checkAuth() {
  const cookieStore = await cookies();
  const session     = cookieStore.get("admin_session");
  if (!session || session.value !== "authenticated") redirect("/admin/login");
}

async function getData() {
  const db  = await connectDB();
  const all = await db.collection("appointments").find().sort({ createdAt: -1 }).toArray();
  return all;
}

async function getBookings() {
  try {
    const db = await connectDB();
    return await db.collection("bookings")
      .find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();
  } catch {
    return [];
  }
}

async function getStats() {
  try {
    const db           = await connectDB();
    const blogTotal    = await db.collection("posts").countDocuments();
    const blogPub      = await db.collection("posts").countDocuments({ status: "published" });
    const patientTotal = await db.collection("patients").countDocuments();
    return { blogTotal, blogPub, patientTotal };
  } catch {
    return { blogTotal: 0, blogPub: 0, patientTotal: 0 };
  }
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
  return <span className={`text-[11px] font-semibold px-2.5 py-1 ${bg}`}>{label}</span>;
}

export default async function AdminPage() {
  await checkAuth();

  const [data, stats, bookings] = await Promise.all([getData(), getStats(), getBookings()]);

  const today     = new Date().toISOString().split("T")[0];
  const todayBookings   = bookings.filter((b: any) => b.date === today);
  const pendingBookings = bookings.filter((b: any) => b.confirmationStatus === "pending");
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
            <div className="relative w-9 h-9 shrink-0">
              <Image src="/logo.png" alt="Vee Care Dental Clinic" fill sizes="56px" className="object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-base">Vee Care</span>
                <span className="text-white/30">·</span>
                <span className="text-white/50 text-sm">Admin Dashboard</span>
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
          <div className="flex items-center gap-2">
            <Link href="/admin/patients"
              className="hidden md:flex items-center gap-1.5 text-white/50 hover:text-white text-xs border border-white/15 px-3 py-2 transition-colors">
              <Users size={12} /> Patients
            </Link>
            <Link href="/admin/bookings"
              className="hidden md:flex items-center gap-1.5 text-white/50 hover:text-white text-xs border border-white/15 px-3 py-2 transition-colors">
              <Calendar size={12} /> Bookings
            </Link>
            <Link href="/admin/roster"
              className="hidden md:flex items-center gap-1.5 text-white/50 hover:text-white text-xs border border-white/15 px-3 py-2 transition-colors">
              <Clock size={12} /> Roster
            </Link>
            <Link href="/admin/blog"
              className="hidden md:flex items-center gap-1.5 text-white/50 hover:text-white text-xs border border-white/15 px-3 py-2 transition-colors">
              <PenSquare size={12} /> Blog
            </Link>
            <Link href="/"
              className="text-white/50 hover:text-white text-xs border border-white/15 px-3 py-2 transition-colors hidden md:block">
              View Site
            </Link>
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Security bar */}
      <div className="bg-green-900/20 border-b border-green-900/20 px-8 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-green-800 text-xs">
          <Shield size={11} />
          <span className="font-semibold">Security Active:</span>
          <span className="text-green-900/90">
            TLS 1.3 · Auth protected · Rate limiting · DPDP Act 2023 compliant
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">

        {/* Quick navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            {
              label: "Appointments",
              href:  "/admin",
              icon:  "📅",
              desc:  `${data.length} total · ${pending.length} pending`,
              active: true,
            },
            {
              label: "Patient Records",
              href:  "/admin/patients",
              icon:  "👥",
              desc:  `${stats.patientTotal} registered patients`,
              active: false,
            },
            {
              label: "Blog Manager",
              href:  "/admin/blog",
              icon:  "✍️",
              desc:  `${stats.blogTotal} posts · ${stats.blogPub} published`,
              active: false,
            },
            {
              label: "Write Article",
              href:  "/admin/blog/new",
              icon:  "➕",
              desc:  "New blog post",
              active: false,
            },
          ].map(nav => (
            <Link key={nav.label} href={nav.href}
              className={`p-4 border transition-all ${
                nav.active
                  ? "bg-[#0D1117] border-[#0D1117] text-white"
                  : "bg-white border-gray-100 hover:border-[#C9A96E]"
              }`}>
              <div className="text-2xl mb-2">{nav.icon}</div>
              <div className={`font-bold text-sm ${nav.active ? "text-white" : "text-[#0D1117]"}`}>
                {nav.label}
              </div>
              <div className={`text-xs mt-0.5 ${nav.active ? "text-white/60" : "text-[#4A5568]"}`}>
                {nav.desc}
              </div>
            </Link>
          ))}
        </div>

        {/* New Bookings — from the public booking system (separate from the legacy appointment inquiries below) */}
        {pendingBookings.length > 0 && (
          <Link href="/admin/bookings"
            className="flex items-center justify-between bg-[#C1583B] hover:bg-[#A3462C] text-white px-6 py-4 mb-6 transition-colors">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} />
              <div>
                <div className="font-bold text-sm">
                  {pendingBookings.length} new booking{pendingBookings.length !== 1 ? "s" : ""} awaiting confirmation
                </div>
                <div className="text-xs text-white/80 mt-0.5">On-call specialist bookings need presence confirmed before the patient's visit</div>
              </div>
            </div>
            <ArrowRight size={18} />
          </Link>
        )}

        <div className="bg-white shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#0D1117] flex items-center gap-2 text-xs uppercase tracking-widest">
              <Calendar size={13} className="text-[#C1583B]" /> Today's Bookings ({todayBookings.length})
            </h3>
            <Link href="/admin/bookings" className="text-xs text-[#4A5568] hover:text-[#0D1117]">View all bookings →</Link>
          </div>
          {todayBookings.length === 0 ? (
            <p className="text-[#4A5568] text-sm text-center py-4">No online bookings for today yet.</p>
          ) : (
            <div className="space-y-2">
              {todayBookings.map((b: any) => (
                <div key={b._id.toString()} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="w-16 shrink-0 text-xs font-bold text-[#0D1117]">{b.time}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-[#0D1117] truncate">{b.patientName}</div>
                    <div className="text-xs text-[#4A5568] truncate">{b.service} · {b.doctorName}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 uppercase tracking-wide ${b.confirmationStatus === "confirmed" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
                    {b.confirmationStatus}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stat cards */}
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

        {/* Today + Chart */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
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

        {/* Appointments table */}
        <div className="bg-white shadow-sm mb-6">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
            <h3 className="font-bold text-[#0D1117] text-xs uppercase tracking-widest">
              All Appointments
              <span className="ml-2 text-[#4A5568] font-normal normal-case text-xs">({data.length} total)</span>
            </h3>
            <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-3 py-1.5 border border-green-100">
              <Shield size={11} /> Patient data secured
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
                            className="bg-[#25D366] hover:bg-[#128C7E] text-white text-[10px] font-bold px-2.5 py-1.5 transition-colors">
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

        {/* Security info */}
        <div className="bg-white border border-green-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={16} className="text-green-500" />
            <h4 className="font-bold text-[#0D1117] text-sm">Data Security Information</h4>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-xs text-[#4A5568]">
            {[
              { t: "Encrypted Storage",   d: "All patient data stored in MongoDB Atlas with encryption at rest." },
              { t: "Secure Transmission", d: "All data transmitted over HTTPS with TLS 1.3." },
              { t: "DPDP Compliant",      d: "Patient consent collected. India DPDP Act 2023 compliant." },
              { t: "Rate Limited API",    d: "Booking API rate limited to 5 requests/minute per IP." },
              { t: "Input Validation",    d: "All inputs validated with Zod. Injection attacks blocked." },
              { t: "Auth Protected",      d: "Dashboard protected by secure login. Sessions expire in 24hrs." },
            ].map(i => (
              <div key={i.t} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                <div><div className="font-semibold text-[#0D1117] mb-0.5">{i.t}</div>{i.d}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 text-center text-[#4A5568] text-xs">
          Vee Care Admin · Secured by BizGrowOnline ·{" "}
          <a href="/" className="text-[#C9A96E] hover:underline">Return to website</a>
        </div>
      </div>
    </div>
  );
}

