"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm]     = useState({ username: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    const res  = await fetch("/api/admin/login", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(form),
    });
    const data = await res.json();

    if (data.success) {
      router.push("/admin");
    } else {
      setError("Invalid username or password.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center px-6">
      <div className="bg-white w-full max-w-sm p-10">
        <div className="text-center mb-8">
          <div className="relative w-14 h-14 mx-auto mb-4">
            <Image src="/logo.png" alt="Vee Care Dental Clinic" fill className="object-contain" />
          </div>
          <h1 className="display-text text-[#0D1117] text-2xl">Admin Login</h1>
          <p className="text-[#4A5568] text-sm mt-1">Vee Care Dashboard</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-[#0D1117] mb-2">
              Username
            </label>
            <input
              type="text"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none transition-colors"
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase text-[#0D1117] mb-2">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none transition-colors"
              placeholder="Enter password"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="btn-primary w-full justify-center mt-2 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login to Dashboard"}
          </button>
        </div>
      </div>
    </div>
  );
}