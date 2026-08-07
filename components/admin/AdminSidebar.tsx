"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Calendar, CalendarClock, Users, PenSquare, LogOut, ExternalLink,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/admin/roster", label: "Roster", icon: CalendarClock },
  { href: "/admin/patients", label: "Patients", icon: Users },
  { href: "/admin/blog", label: "Blog", icon: PenSquare },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname?.startsWith(href);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <aside className="w-60 shrink-0 bg-[#0D1117] min-h-screen flex flex-col print:hidden">
      <div className="flex items-center gap-2.5 px-6 py-6 border-b border-white/10">
        <div className="relative w-9 h-9 shrink-0">
          <Image src="/logo.png" alt="Vee Care Dental Clinic" fill sizes="36px" className="object-contain" />
        </div>
        <div>
          <div className="text-white font-bold text-sm leading-tight">Vee Care</div>
          <div className="text-[10px] text-white/40 tracking-wide">Admin Dashboard</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(item => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                active ? "bg-[#C1583B] text-white font-medium" : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon size={17} strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
        >
          <ExternalLink size={17} strokeWidth={1.75} />
          View Site
        </a>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors w-full text-left"
        >
          <LogOut size={17} strokeWidth={1.75} />
          Logout
        </button>
      </div>
    </aside>
  );
}
