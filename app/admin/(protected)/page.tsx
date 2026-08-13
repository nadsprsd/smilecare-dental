import { connectDB }   from "@/lib/mongodb";
import { cookies }     from "next/headers";
import { redirect }    from "next/navigation";
import Link            from "next/link";
import Image           from "next/image";
import {
  Calendar, Clock, Phone, ArrowRight,
  TrendingUp, CheckCircle, AlertCircle, Shield, PenSquare, Users,
} from "lucide-react";
import { getISTDateString } from "@/lib/constants";

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

async function getBookingStats() {
  try {
    const db = await connectDB();
    const today = getISTDateString();
    const [total, todayCount, pendingCount, confirmedCount] = await Promise.all([
      db.collection("bookings").countDocuments({}),
      db.collection("bookings").countDocuments({ date: today, isActive: true }),
      db.collection("bookings").countDocuments({ confirmationStatus: "pending", isActive: true }),
      db.collection("bookings").countDocuments({ confirmationStatus: "confirmed", isActive: true }),
    ]);
    return { total, today: todayCount, pending: pendingCount, confirmed: confirmedCount };
  } catch {
    return { total: 0, today: 0, pending: 0, confirmed: 0 };
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

export default async function AdminPage() {
  const [data, stats, bookings, bookingStats] = await Promise.all([getData(), getStats(), getBookings(), getBookingStats()]);

  const today     = getISTDateString();
  const todayBookings   = bookings.filter((b: any) => b.date === today);
  const pendingBookings = bookings.filter((b: any) => b.confirmationStatus === "pending");

  // Combines the legacy appointment inquiries with real bookings so this
  // reflects actual demand, not just the old system's data.
  const serviceCounts: Record<string, number> = {};
  [...data, ...bookings].forEach((d: any) => {
    const s = d.service || "Other";
    serviceCounts[s] = (serviceCounts[s] || 0) + 1;
  });
  const topServices = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxCount    = topServices[0]?.[1] || 1;

  return (
    <div>

      {/* Page header */}
      <div className="bg-white border-b border-gray-100 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-xl text-[#0D1117]">Dashboard</h1>
            <p className="text-[#4A5568] text-xs mt-0.5">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long", day: "numeric", month: "long", year: "numeric",
              })}
            </p>
          </div>
          <span className="flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold px-2.5 py-1 rounded-full">
            <Shield size={10} /> SECURED
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-8 py-8">

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
            { label: "Total Bookings", value: bookingStats.total,      Icon: Calendar,    color: "text-[#0D1117]",  border: "border-t-2 border-[#0D1117]"  },
            { label: "Today",          value: bookingStats.today,      Icon: Clock,       color: "text-blue-600",   border: "border-t-2 border-blue-500"   },
            { label: "Pending",        value: bookingStats.pending,    Icon: AlertCircle, color: "text-yellow-600", border: "border-t-2 border-yellow-400" },
            { label: "Confirmed",      value: bookingStats.confirmed,  Icon: CheckCircle, color: "text-green-600",  border: "border-t-2 border-green-500"  },
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

        {/* Most Booked Services */}
        <div className="mb-8">
          <div className="bg-white shadow-sm p-6">
            <h3 className="font-bold text-[#0D1117] mb-5 flex items-center gap-2 text-xs uppercase tracking-widests">
              <TrendingUp size={13} className="text-[#C1583B]" /> Most Booked Services
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
                      <div className="h-2 bg-[#C1583B]" style={{ width: `${(count / maxCount) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
          <a href="/" className="text-[#C1583B] hover:underline">Return to website</a>
        </div>
      </div>
    </div>
  );
}

