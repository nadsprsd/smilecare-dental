"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router  = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="text-white/60 hover:text-white text-xs border border-white/15 hover:border-white/40 px-3 py-2 transition-all disabled:opacity-50"
    >
      {loading ? "..." : "Logout"}
    </button>
  );
}

